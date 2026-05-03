import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { ReviewStatus, Role, UserStatus } from "../src/generated/client";

type GenericIndustry = {
  id?: string;
  name: string;
  description?: string;
  popularTitles?: string[];
};

type GenericExpert = {
  id?: string;
  fullName: string;
  title?: string;
  bio?: string;
  experience?: number;
  price?: number;
  consultationFee?: number;
  industryId?: string;
  rating?: number;
  totalReviews?: number;
  email?: string;
  phone?: string;
  profilePhoto?: string;
};

type GenericReview = {
  id?: string;
  expertId: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

type GenericSeedInput = {
  industries: GenericIndustry[];
  experts: GenericExpert[];
  reviews: GenericReview[];
};

type PrismaSeedOutput = {
  industries: Array<{
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
  }>;
  expertUsers: Array<{
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: Role;
    status: UserStatus;
    needPasswordChange: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  clientUsers: Array<{
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: Role;
    status: UserStatus;
    needPasswordChange: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  clients: Array<{
    id: string;
    fullName: string;
    email: string;
    profilePhoto: string | null;
    phone: string | null;
    address: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  experts: Array<{
    id: string;
    fullName: string;
    email: string;
    profilePhoto: string | null;
    phone: string | null;
    bio: string | null;
    title: string | null;
    experience: number;
    consultationFee: number;
    isVerified: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    userId: string;
    industryId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  testimonials: Array<{
    id: string;
    rating: number;
    comment: string | null;
    status: ReviewStatus;
    expertReply: string | null;
    expertRepliedAt: string | null;
    clientId: string;
    expertId: string;
    consultationId: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  summary: {
    industries: number;
    expertUsers: number;
    clientUsers: number;
    clients: number;
    experts: number;
    testimonials: number;
  };
};

const nowIso = () => new Date().toISOString();

const normalizeEmailLocalPart = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 48) || "user";

const clampInt = (value: unknown, min: number, max: number, fallback: number) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
};

const parseInput = async (inputPath: string): Promise<GenericSeedInput> => {
  const raw = await readFile(inputPath, "utf8");
  const parsed = JSON.parse(raw) as Partial<GenericSeedInput>;

  if (!Array.isArray(parsed.industries)) {
    throw new Error("Input must include an industries array");
  }

  if (!Array.isArray(parsed.experts)) {
    throw new Error("Input must include an experts array");
  }

  if (!Array.isArray(parsed.reviews)) {
    throw new Error("Input must include a reviews array");
  }

  return {
    industries: parsed.industries,
    experts: parsed.experts,
    reviews: parsed.reviews,
  };
};

const transform = (input: GenericSeedInput): PrismaSeedOutput => {
  const generatedAt = nowIso();

  const industries = input.industries.map((industry, index) => ({
    id: industry.id || randomUUID(),
    name: String(industry.name || `Industry ${index + 1}`).trim(),
    description: industry.description?.trim() || null,
    icon: null,
    createdAt: generatedAt,
    updatedAt: generatedAt,
    isDeleted: false,
    deletedAt: null,
  }));

  const industryIdSet = new Set(industries.map((row) => row.id));

  const fallbackIndustryId = industries[0]?.id;
  if (!fallbackIndustryId) {
    throw new Error("At least one industry is required to transform experts");
  }

  const usedEmails = new Set<string>();

  const expertUsers: PrismaSeedOutput["expertUsers"] = [];
  const experts: PrismaSeedOutput["experts"] = [];

  input.experts.forEach((expert, idx) => {
    const expertId = expert.id || randomUUID();
    const userId = randomUUID();
    const fullName = String(expert.fullName || `Expert ${idx + 1}`).trim();

    const emailBase = normalizeEmailLocalPart(fullName);
    let email = `${emailBase}.expert@consultedge.test`;
    let salt = 1;
    while (usedEmails.has(email)) {
      email = `${emailBase}.expert${salt}@consultedge.test`;
      salt += 1;
    }
    usedEmails.add(email);

    const industryId =
      expert.industryId && industryIdSet.has(expert.industryId)
        ? expert.industryId
        : fallbackIndustryId;

    expertUsers.push({
      id: userId,
      name: fullName,
      email,
      emailVerified: true,
      role: Role.EXPERT,
      status: UserStatus.ACTIVE,
      needPasswordChange: false,
      isDeleted: false,
      deletedAt: null,
      image: expert.profilePhoto?.trim() || null,
      createdAt: generatedAt,
      updatedAt: generatedAt,
    });

    experts.push({
      id: expertId,
      fullName,
      email,
      profilePhoto: expert.profilePhoto?.trim() || null,
      phone: expert.phone?.trim() || null,
      bio: expert.bio?.trim() || null,
      title: expert.title?.trim() || null,
      experience: clampInt(expert.experience, 1, 20, 5),
      consultationFee: clampInt(expert.consultationFee ?? expert.price, 20, 300, 50),
      isVerified: true,
      isDeleted: false,
      deletedAt: null,
      userId,
      industryId,
      createdAt: generatedAt,
      updatedAt: generatedAt,
    });
  });

  const expertsById = new Map(experts.map((row) => [row.id, row]));

  const clientPoolSize = Math.max(50, Math.min(300, Math.ceil(input.reviews.length / 3)));

  const clientUsers: PrismaSeedOutput["clientUsers"] = [];
  const clients: PrismaSeedOutput["clients"] = [];

  for (let i = 0; i < clientPoolSize; i += 1) {
    const userId = randomUUID();
    const clientId = randomUUID();
    const fullName = `Client User ${String(i + 1).padStart(3, "0")}`;
    const email = `client${String(i + 1).padStart(3, "0")}@consultedge.test`;

    clientUsers.push({
      id: userId,
      name: fullName,
      email,
      emailVerified: true,
      role: Role.CLIENT,
      status: UserStatus.ACTIVE,
      needPasswordChange: false,
      isDeleted: false,
      deletedAt: null,
      image: null,
      createdAt: generatedAt,
      updatedAt: generatedAt,
    });

    clients.push({
      id: clientId,
      fullName,
      email,
      profilePhoto: null,
      phone: null,
      address: null,
      isDeleted: false,
      deletedAt: null,
      userId,
      createdAt: generatedAt,
      updatedAt: generatedAt,
    });
  }

  const testimonials: PrismaSeedOutput["testimonials"] = input.reviews
    .filter((review) => expertsById.has(review.expertId))
    .map((review, index) => {
      const createdAt = review.createdAt ? new Date(review.createdAt) : new Date();
      const normalizedCreatedAt = Number.isNaN(createdAt.valueOf()) ? new Date() : createdAt;

      const rating = clampInt(review.rating, 1, 5, 4);
      const status =
        rating >= 4 ? ReviewStatus.APPROVED : rating === 3 ? ReviewStatus.PENDING : ReviewStatus.HIDDEN;

      return {
        id: review.id || randomUUID(),
        rating,
        comment: review.comment?.trim() || null,
        status,
        expertReply: null,
        expertRepliedAt: null,
        clientId: clients[index % clients.length].id,
        expertId: review.expertId,
        consultationId: null,
        createdAt: normalizedCreatedAt.toISOString(),
        updatedAt: normalizedCreatedAt.toISOString(),
      };
    });

  return {
    industries,
    expertUsers,
    clientUsers,
    clients,
    experts,
    testimonials,
    summary: {
      industries: industries.length,
      expertUsers: expertUsers.length,
      clientUsers: clientUsers.length,
      clients: clients.length,
      experts: experts.length,
      testimonials: testimonials.length,
    },
  };
};

const run = async () => {
  const inputArg = process.argv[2];
  const outputArg = process.argv[3] || "prisma/seed-data.json";

  if (!inputArg) {
    throw new Error(
      "Usage: tsx prisma/seed-transform.ts <input-json-path> [output-json-path]"
    );
  }

  const inputPath = path.resolve(process.cwd(), inputArg);
  const outputPath = path.resolve(process.cwd(), outputArg);

  const input = await parseInput(inputPath);
  const transformed = transform(input);

  await writeFile(outputPath, JSON.stringify(transformed, null, 2), "utf8");

  console.log("Seed transform completed successfully", {
    input: inputPath,
    output: outputPath,
    summary: transformed.summary,
  });
};

run().catch((error) => {
  console.error("Seed transform failed", error);
  process.exit(1);
});
