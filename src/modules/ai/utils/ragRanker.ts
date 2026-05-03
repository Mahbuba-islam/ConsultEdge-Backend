export type RagContextItem = {
  source_id: string;
  content: string;
  metadata?: Record<string, unknown>;
};

export type RankedContextItem = RagContextItem & {
  score: number;
};

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);

const normalize = (value: string) => value.trim().toLowerCase();

const parseDateScore = (createdAtValue: unknown): number => {
  if (typeof createdAtValue !== "string") return 0;
  const parsed = new Date(createdAtValue);
  if (Number.isNaN(parsed.valueOf())) return 0;

  const ageDays = Math.max(0, (Date.now() - parsed.valueOf()) / (1000 * 60 * 60 * 24));
  if (ageDays <= 7) return 0.08;
  if (ageDays <= 30) return 0.05;
  if (ageDays <= 90) return 0.03;
  return 0;
};

const qualityScore = (metadata?: Record<string, unknown>): number => {
  if (!metadata) return 0;
  const rating = Number(metadata.rating ?? 0);
  const totalReviews = Number(metadata.totalReviews ?? 0);

  let score = 0;
  if (Number.isFinite(rating) && rating >= 4.5) score += 0.06;
  else if (Number.isFinite(rating) && rating >= 4.0) score += 0.03;

  if (Number.isFinite(totalReviews) && totalReviews >= 100) score += 0.05;
  else if (Number.isFinite(totalReviews) && totalReviews >= 20) score += 0.03;

  score += parseDateScore(metadata.createdAt);

  return Math.min(0.15, score);
};

export const rankRagContext = (
  query: string,
  context: RagContextItem[],
  topK = 6
): RankedContextItem[] => {
  const normalizedQuery = normalize(query);
  const queryTokens = tokenize(query);
  const tokenSet = new Set(queryTokens);

  const ranked = context
    .filter((item) => item.source_id?.trim() && item.content?.trim())
    .map((item) => {
      const text = normalize(item.content);
      const textTokens = tokenize(text);
      const textTokenSet = new Set(textTokens);

      const exactPhraseMatch = normalizedQuery.length > 2 && text.includes(normalizedQuery) ? 1 : 0;

      let overlapCount = 0;
      for (const token of tokenSet) {
        if (textTokenSet.has(token)) overlapCount += 1;
      }

      const overlapScore = tokenSet.size > 0 ? overlapCount / tokenSet.size : 0;
      const lengthPenalty = text.length > 4000 ? 0.05 : 0;

      const score = exactPhraseMatch * 0.6 + overlapScore * 0.4 + qualityScore(item.metadata) - lengthPenalty;

      return {
        ...item,
        score: Math.max(0, Math.min(1, Number(score.toFixed(4)))),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, topK));

  return ranked;
};
