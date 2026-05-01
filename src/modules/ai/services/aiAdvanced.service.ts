import { aiProvider } from "../utils/aiProvider";
import {
  summaryPrompt,
  searchPrompt,
  buildChatMessages,
  documentAnalysisPrompt,
} from "../prompts";
import { sanitizeText } from "../utils/sanitize";
import { prisma } from "../../../lib/prisma";
import { ReviewStatus } from "../../../generated/client";

export type AIMeta = {
  model: string;
  provider: string;
  tokensUsed: number;
  latencyMs: number;
};

export type AIRecommendationsInput = {
  viewedExperts?: string[];
  exploredIndustries?: string[];
  searchHistory?: string[];
  clickedCategories?: string[];
};

export type AIRecommendationsResult = {
  mode: "cold-start" | "personalized";
  activityCount: number;
  experts: Array<{
    name: string;
    title: string;
    specialization: string;
    description: string;
    experienceYears: number;
    fee: number;
    whyReason: string;
    rankingScore: number;
  }>;
};

export type AIIndustryCreationInput = {
  industryName: string;
};

export type AIIndustryCreationResult = {
  industryName: string;
  industryDescription: string;
  idealExpertTypes: string[];
  commonUseCases: string[];
  shortTagline: string;
};

type ExpertCandidate = {
  id: string;
  name: string;
  title: string;
  industry: string;
  description: string;
  experienceYears: number;
  fee: number;
  isVerified: boolean;
  averageRating: number;
  reviewCount: number;
  weeklyBookings: number;
  totalBookings: number;
};

const normalizeList = (items?: string[]): string[] => {
  if (!Array.isArray(items)) return [];
  return Array.from(
    new Set(
      items
        .map((item) => sanitizeText(item, 140).trim())
        .filter((item) => item.length > 0)
    )
  );
};

const normalizeTerm = (value: string) => value.trim().toLowerCase();

const getWeekStartUtc = () => {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diff));
};

const roundScore = (value: number) => Math.round(Math.max(0, Math.min(100, value)) * 100) / 100;

const buildEmptyStateFallback = (
  mode: "cold-start" | "personalized",
  context: {
    exploredIndustries: string[];
    viewedExperts: string[];
    searchHistory: string[];
    clickedCategories: string[];
  }
): AIRecommendationsResult["experts"] => {
  const personalizedReason =
    context.exploredIndustries[0]
      ? `Why: Because you explored ${context.exploredIndustries[0]}`
      : context.viewedExperts[0]
        ? `Why: Because you viewed ${context.viewedExperts[0]}`
        : context.searchHistory[0]
          ? `Why: Because you searched "${context.searchHistory[0]}"`
          : context.clickedCategories[0]
            ? `Why: Because you clicked on ${context.clickedCategories[0]}`
            : "Why: Because you interacted with similar experts";

  return [
    {
      name: "ConsultEdge Growth Advisor",
      title: "Startup Growth Consultant",
      specialization: "Go-to-market and growth strategy",
      description:
        "Helps early-stage teams shape positioning, channel strategy, and execution plans.",
      experienceYears: 10,
      fee: 120,
      whyReason:
        mode === "cold-start" ? "Why: Popular among new users" : personalizedReason,
      rankingScore: 86,
    },
    {
      name: "ConsultEdge Finance Mentor",
      title: "Finance and Fundraising Specialist",
      specialization: "Fundraising readiness and financial planning",
      description:
        "Supports founders with investor narratives, runway planning, and capital strategy.",
      experienceYears: 12,
      fee: 140,
      whyReason: mode === "cold-start" ? "Why: Verified specialist" : personalizedReason,
      rankingScore: 82,
    },
    {
      name: "ConsultEdge Product Strategist",
      title: "Product and Customer Strategy Expert",
      specialization: "Product-market fit and retention",
      description:
        "Works with teams to improve customer journeys, retention, and product prioritization.",
      experienceYears: 9,
      fee: 110,
      whyReason: mode === "cold-start" ? "Why: Trending this week" : personalizedReason,
      rankingScore: 79,
    },
  ];
};

const buildColdStartReason = (expert: ExpertCandidate): string => {
  if (expert.weeklyBookings >= 2) return "Why: Frequently booked by founders";
  if (expert.averageRating >= 4.5) return "Why: High success rate";
  if (expert.isVerified) return "Why: Verified specialist";
  if (expert.totalBookings >= 5) return "Why: Trending this week";
  return "Why: Popular among new users";
};

const buildPersonalizedReason = (
  expert: ExpertCandidate,
  context: {
    exploredIndustries: string[];
    viewedExperts: string[];
    searchHistory: string[];
    clickedCategories: string[];
    viewedIndustrySet: Set<string>;
  }
): string => {
  const normalizedIndustry = normalizeTerm(expert.industry);
  const explored = context.exploredIndustries.find(
    (industry) => normalizeTerm(industry) === normalizedIndustry
  );
  if (explored) return `Why: Because you explored ${explored}`;

  const viewed = context.viewedExperts.find((item) => {
    const token = normalizeTerm(item);
    return token === normalizeTerm(expert.id) || token === normalizeTerm(expert.name);
  });
  if (viewed) return `Why: Because you viewed ${viewed}`;

  const haystack = `${expert.title} ${expert.description} ${expert.industry}`.toLowerCase();
  const searchedKeyword = context.searchHistory.find((keyword) =>
    haystack.includes(normalizeTerm(keyword))
  );
  if (searchedKeyword) return `Why: Because you searched "${searchedKeyword}"`;

  const clickedCategory = context.clickedCategories.find((category) =>
    haystack.includes(normalizeTerm(category))
  );
  if (clickedCategory) return `Why: Because you clicked on ${clickedCategory}`;

  if (context.viewedIndustrySet.has(normalizedIndustry)) {
    return "Why: Because you interacted with similar experts";
  }

  return "Why: Because you interacted with similar experts";
};

const fetchExpertCandidates = async (): Promise<ExpertCandidate[]> => {
  const weekStart = getWeekStartUtc();

  const [experts, ratings, weeklyBookings, totalBookings] = await Promise.all([
    prisma.expert.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        fullName: true,
        title: true,
        bio: true,
        experience: true,
        consultationFee: true,
        isVerified: true,
        industry: { select: { name: true } },
      },
      orderBy: [{ isVerified: "desc" }, { updatedAt: "desc" }],
      take: 120,
    }),
    prisma.testimonial.groupBy({
      by: ["expertId"],
      where: { status: ReviewStatus.APPROVED },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.consultation.groupBy({
      by: ["expertId"],
      where: {
        expertId: { not: null },
        createdAt: { gte: weekStart },
      },
      _count: { _all: true },
    }),
    prisma.consultation.groupBy({
      by: ["expertId"],
      where: { expertId: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const ratingMap = new Map(
    ratings.map((item) => [
      item.expertId,
      {
        avg: item._avg.rating ?? 0,
        count: item._count._all,
      },
    ])
  );

  const weeklyBookingMap = new Map(
    weeklyBookings
      .filter((item): item is typeof item & { expertId: string } => !!item.expertId)
      .map((item) => [item.expertId, item._count._all])
  );

  const totalBookingMap = new Map(
    totalBookings
      .filter((item): item is typeof item & { expertId: string } => !!item.expertId)
      .map((item) => [item.expertId, item._count._all])
  );

  return experts.map((expert) => {
    const ratingStats = ratingMap.get(expert.id);
    return {
      id: expert.id,
      name: expert.fullName,
      title: expert.title?.trim() || "Business Consultant",
      industry: expert.industry.name,
      description:
        expert.bio?.trim() ||
        `${expert.fullName} advises teams on ${expert.industry.name.toLowerCase()} priorities.`,
      experienceYears: Math.max(0, expert.experience ?? 0),
      fee: Math.max(0, expert.consultationFee ?? 0),
      isVerified: expert.isVerified,
      averageRating: ratingStats?.avg ?? 0,
      reviewCount: ratingStats?.count ?? 0,
      weeklyBookings: weeklyBookingMap.get(expert.id) ?? 0,
      totalBookings: totalBookingMap.get(expert.id) ?? 0,
    };
  });
};

const recommendations = async (
  input: AIRecommendationsInput
): Promise<{ data: AIRecommendationsResult; meta: AIMeta }> => {
  try {
    const viewedExperts = normalizeList(input.viewedExperts);
    const exploredIndustries = normalizeList(input.exploredIndustries);
    const searchHistory = normalizeList(input.searchHistory);
    const clickedCategories = normalizeList(input.clickedCategories);

    const activityCount =
      viewedExperts.length +
      exploredIndustries.length +
      searchHistory.length +
      clickedCategories.length;
    const mode: "cold-start" | "personalized" =
      activityCount === 0 ? "cold-start" : "personalized";

    const candidates = await fetchExpertCandidates();
    if (candidates.length === 0) {
      return {
        data: {
          mode,
          activityCount,
          experts: buildEmptyStateFallback(mode, {
            exploredIndustries,
            viewedExperts,
            searchHistory,
            clickedCategories,
          }),
        },
        meta: {
          model: "heuristic",
          provider: "fallback",
          tokensUsed: 0,
          latencyMs: 0,
        },
      };
    }

    const viewedTokenSet = new Set(viewedExperts.map(normalizeTerm));
    const exploredIndustrySet = new Set(exploredIndustries.map(normalizeTerm));
    const searchTokens = new Set(
      searchHistory
        .flatMap((query) => query.split(/\s+/))
        .map(normalizeTerm)
        .filter((token) => token.length > 1)
    );
    const clickedCategorySet = new Set(clickedCategories.map(normalizeTerm));

    const viewedMatches = candidates.filter((candidate) => {
      const byId = viewedTokenSet.has(normalizeTerm(candidate.id));
      const byName = viewedTokenSet.has(normalizeTerm(candidate.name));
      return byId || byName;
    });
    const viewedIndustrySet = new Set(viewedMatches.map((item) => normalizeTerm(item.industry)));

    const scored = candidates
      .map((candidate) => {
        let score = 35;

        if (candidate.isVerified) score += 10;
        if (candidate.averageRating >= 4.7) score += 8;
        else if (candidate.averageRating >= 4.3) score += 5;

        if (candidate.weeklyBookings >= 4) score += 12;
        else if (candidate.weeklyBookings >= 2) score += 8;
        else if (candidate.weeklyBookings >= 1) score += 4;

        score += Math.min(10, candidate.totalBookings * 0.6);

        if (mode === "personalized") {
          const candidateIndustry = normalizeTerm(candidate.industry);
          const haystack = `${candidate.name} ${candidate.title} ${candidate.description} ${candidate.industry}`.toLowerCase();

          const sameIndustry = exploredIndustrySet.has(candidateIndustry);
          if (sameIndustry) score += 24;

          const viewedThisExpert =
            viewedTokenSet.has(normalizeTerm(candidate.id)) ||
            viewedTokenSet.has(normalizeTerm(candidate.name));
          if (viewedThisExpert) score += 18;
          else if (viewedIndustrySet.has(candidateIndustry)) score += 14;

          const matchedSearch = Array.from(searchTokens).some(
            (token) => token.length > 1 && haystack.includes(token)
          );
          if (matchedSearch) score += 14;

          const matchedCategory = Array.from(clickedCategorySet).some(
            (category) => category.length > 1 && haystack.includes(category)
          );
          if (matchedCategory) score += 12;
        }

        const whyReason =
          mode === "cold-start"
            ? buildColdStartReason(candidate)
            : buildPersonalizedReason(candidate, {
                exploredIndustries,
                viewedExperts,
                searchHistory,
                clickedCategories,
                viewedIndustrySet,
              });

        return {
          name: candidate.name,
          title: candidate.title,
          specialization: candidate.industry,
          description: candidate.description,
          experienceYears: candidate.experienceYears,
          fee: candidate.fee,
          whyReason,
          rankingScore: roundScore(score),
        };
      })
      .sort((a, b) => b.rankingScore - a.rankingScore)
      .slice(0, 8);

    return {
      data: {
        mode,
        activityCount,
        experts:
          scored.length > 0
            ? scored
            : buildEmptyStateFallback(mode, {
                exploredIndustries,
                viewedExperts,
                searchHistory,
                clickedCategories,
              }),
      },
      meta: {
        model: "heuristic",
        provider: "fallback",
        tokensUsed: 0,
        latencyMs: 0,
      },
    };
  } catch {
    const viewedExperts = normalizeList(input.viewedExperts);
    const exploredIndustries = normalizeList(input.exploredIndustries);
    const searchHistory = normalizeList(input.searchHistory);
    const clickedCategories = normalizeList(input.clickedCategories);
    const activityCount =
      viewedExperts.length +
      exploredIndustries.length +
      searchHistory.length +
      clickedCategories.length;
    const mode: "cold-start" | "personalized" =
      activityCount === 0 ? "cold-start" : "personalized";

    return {
      data: {
        mode,
        activityCount,
        experts: buildEmptyStateFallback(mode, {
          exploredIndustries,
          viewedExperts,
          searchHistory,
          clickedCategories,
        }),
      },
      meta: { model: "heuristic", provider: "fallback", tokensUsed: 0, latencyMs: 0 },
    };
  }
};

const ensureIndustryArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => sanitizeText(item, 80))
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 8);
};

const ensureTaglineLength = (value: string): string => {
  const cleaned = sanitizeText(value, 120);
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 5 && words.length <= 7) return words.join(" ");
  return words.slice(0, 7).join(" ") || "Optimize every customer moment better";
};

const buildIndustryFallback = (industryName: string): AIIndustryCreationResult => ({
  industryName,
  industryDescription:
    `${industryName} focuses on designing, measuring, and continuously improving the end-to-end customer journey across channels. ` +
    "It blends service operations, experience strategy, and performance analytics to raise satisfaction, loyalty, and growth.",
  idealExpertTypes: [
    "Customer experience strategists",
    "Service design and operations consultants",
    "Contact center transformation leaders",
    "Customer success and retention specialists",
  ],
  commonUseCases: [
    "Improve customer satisfaction and retention",
    "Redesign support workflows and SLAs",
    "Scale omnichannel service operations",
    "Reduce churn through journey optimization",
  ],
  shortTagline: "Elevate service quality at scale",
});

const industryCreation = async (
  input: AIIndustryCreationInput
): Promise<{ data: AIIndustryCreationResult; meta: AIMeta }> => {
  const industryName = sanitizeText(input.industryName, 100).trim() || "General Industry";

  try {
    const { data, meta } = await aiProvider.generateJSON<AIIndustryCreationResult>({
      messages: [
        {
          role: "system",
          content:
            "You are the ConsultEdge admin industry content generator. Return strict JSON only.",
        },
        {
          role: "user",
          content: [
            "Generate a premium SaaS-grade industry profile.",
            "Output JSON shape:",
            '{ "industryName": string, "industryDescription": string, "idealExpertTypes": string[], "commonUseCases": string[], "shortTagline": string }',
            "Rules:",
            "- industryDescription must be 2-3 concise lines.",
            "- idealExpertTypes and commonUseCases must never be empty.",
            "- shortTagline must be 5-7 words.",
            `Industry name: ${industryName}`,
          ].join("\n"),
        },
      ],
      temperature: 0.4,
      maxTokens: 550,
    });

    if (!data) {
      return {
        data: buildIndustryFallback(industryName),
        meta: {
          model: meta.model,
          provider: meta.provider,
          tokensUsed: meta.tokensUsed,
          latencyMs: meta.latencyMs,
        },
      };
    }

    const safe: AIIndustryCreationResult = {
      industryName: sanitizeText(data.industryName, 100).trim() || industryName,
      industryDescription:
        sanitizeText(data.industryDescription, 500).trim() ||
        buildIndustryFallback(industryName).industryDescription,
      idealExpertTypes: ensureIndustryArray(data.idealExpertTypes),
      commonUseCases: ensureIndustryArray(data.commonUseCases),
      shortTagline: ensureTaglineLength(data.shortTagline || ""),
    };

    if (safe.idealExpertTypes.length === 0 || safe.commonUseCases.length === 0) {
      const fallback = buildIndustryFallback(industryName);
      safe.idealExpertTypes = fallback.idealExpertTypes;
      safe.commonUseCases = fallback.commonUseCases;
    }

    return {
      data: safe,
      meta: {
        model: meta.model,
        provider: meta.provider,
        tokensUsed: meta.tokensUsed,
        latencyMs: meta.latencyMs,
      },
    };
  } catch {
    return {
      data: buildIndustryFallback(industryName),
      meta: {
        model: "heuristic",
        provider: "fallback",
        tokensUsed: 0,
        latencyMs: 0,
      },
    };
  }
};

export type AISearchInput = {
  query: string;
  experts: Array<{
    id: string;
    name: string;
    industry?: string;
    expertise?: string[];
    bio?: string;
  }>;
  industries?: string[];
};

export type AISearchResult = {
  experts: Array<{ id: string; score: number; highlight: string }>;
  industries: Array<{ name: string; score: number }>;
  suggestedQueries: string[];
};

const heuristicSearch = (input: AISearchInput): AISearchResult => {
  const q = input.query.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);

  const experts = input.experts
    .map((e) => {
      const haystack = [
        e.name,
        e.industry ?? "",
        (e.expertise ?? []).join(" "),
        e.bio ?? "",
      ]
        .join(" ")
        .toLowerCase();
      const hits = tokens.filter((t) => haystack.includes(t)).length;
      const score = tokens.length ? hits / tokens.length : 0;
      return { id: e.id, score, highlight: e.name };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const industries = (input.industries ?? [])
    .map((name) => ({
      name,
      score: tokens.some((t) => name.toLowerCase().includes(t)) ? 0.8 : 0,
    }))
    .filter((r) => r.score > 0)
    .slice(0, 5);

  return { experts, industries, suggestedQueries: [] };
};

const search = async (
  input: AISearchInput
): Promise<{ data: AISearchResult; meta: AIMeta }> => {
  try {
    const { data, meta } = await aiProvider.generateJSON<AISearchResult>({
      messages: [
        { role: "system", content: "You are ConsultEdge's semantic search engine. Always return strict JSON." },
        { role: "user", content: searchPrompt(input) },
      ],
      temperature: 0.2,
      maxTokens: 700,
    });

    if (!data || !Array.isArray(data.experts)) {
      return {
        data: heuristicSearch(input),
        meta: {
          model: meta.model,
          provider: meta.provider,
          tokensUsed: meta.tokensUsed,
          latencyMs: meta.latencyMs,
        },
      };
    }

    const validIds = new Set(input.experts.map((e) => e.id));
    data.experts = data.experts.filter((r) => validIds.has(r.id)).slice(0, 10);
    data.industries = (data.industries ?? []).slice(0, 5);
    data.suggestedQueries = (data.suggestedQueries ?? []).slice(0, 5);

    return {
      data,
      meta: {
        model: meta.model,
        provider: meta.provider,
        tokensUsed: meta.tokensUsed,
        latencyMs: meta.latencyMs,
      },
    };
  } catch {
    return {
      data: heuristicSearch(input),
      meta: { model: "heuristic", provider: "fallback", tokensUsed: 0, latencyMs: 0 },
    };
  }
};

export type AISummaryInput = { text: string; audience?: string };
export type AISummaryResult = {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
};

const summary = async (
  input: AISummaryInput
): Promise<{ data: AISummaryResult; meta: AIMeta }> => {
  const { data, meta } = await aiProvider.generateJSON<AISummaryResult>({
    messages: [
      { role: "system", content: "You are a consulting analyst. Always return strict JSON." },
      { role: "user", content: summaryPrompt(input) },
    ],
    temperature: 0.3,
    maxTokens: 700,
  });

  const safe: AISummaryResult = {
    summary: data?.summary ?? input.text.slice(0, 280),
    keyPoints: data?.keyPoints ?? [],
    actionItems: data?.actionItems ?? [],
  };

  return {
    data: safe,
    meta: {
      model: meta.model,
      provider: meta.provider,
      tokensUsed: meta.tokensUsed,
      latencyMs: meta.latencyMs,
    },
  };
};

export type AIChatInput = {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  context?: string;
};
export type AIChatResult = { reply: string };

const chat = async (
  input: AIChatInput
): Promise<{ data: AIChatResult; meta: AIMeta }> => {
  const messages = buildChatMessages(input);
  const result = await aiProvider.generate({
    messages,
    temperature: 0.5,
    maxTokens: 500,
  });

  return {
    data: { reply: result.text || "I'm here to help. Could you share a bit more detail?" },
    meta: {
      model: result.model,
      provider: result.provider,
      tokensUsed: result.tokensUsed,
      latencyMs: result.latencyMs,
    },
  };
};

export type AIDocumentAnalysisInput = { text: string; objective?: string };
export type AIDocumentAnalysisResult = {
  summary: string;
  topics: string[];
  entities: { people: string[]; organizations: string[]; locations: string[] };
  risks: string[];
  opportunities: string[];
  recommendedExperts: string[];
};

const documentAnalysis = async (
  input: AIDocumentAnalysisInput
): Promise<{ data: AIDocumentAnalysisResult; meta: AIMeta }> => {
  const cleanText = sanitizeText(input.text, 16000);
  const { data, meta } = await aiProvider.generateJSON<AIDocumentAnalysisResult>({
    messages: [
      { role: "system", content: "You are a consulting document analyst. Always return strict JSON." },
      {
        role: "user",
        content: documentAnalysisPrompt({ text: cleanText, objective: input.objective }),
      },
    ],
    temperature: 0.2,
    maxTokens: 1200,
  });

  const safe: AIDocumentAnalysisResult = {
    summary: data?.summary ?? "",
    topics: data?.topics ?? [],
    entities: {
      people: data?.entities?.people ?? [],
      organizations: data?.entities?.organizations ?? [],
      locations: data?.entities?.locations ?? [],
    },
    risks: data?.risks ?? [],
    opportunities: data?.opportunities ?? [],
    recommendedExperts: data?.recommendedExperts ?? [],
  };

  return {
    data: safe,
    meta: {
      model: meta.model,
      provider: meta.provider,
      tokensUsed: meta.tokensUsed,
      latencyMs: meta.latencyMs,
    },
  };
};

export const aiAdvancedService = {
  recommendations,
  industryCreation,
  search,
  summary,
  chat,
  documentAnalysis,
};
