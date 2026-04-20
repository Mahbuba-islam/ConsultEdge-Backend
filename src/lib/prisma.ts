import { PrismaPg } from '@prisma/adapter-pg';
import "dotenv/config";

import { envVars } from '../config/env';
import { PrismaClient } from '../generated/client';


const connectionString = envVars.DATABASE_URL;

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

type ConnectOptions = {
	retries?: number;
	retryDelayMs?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatConnectionError = (error: unknown) => {
	if (error instanceof Error) {
		return error.message;
	}

	return "Unknown database connection error";
};

const connectPrismaWithRetry = async ({
	retries = 3,
	retryDelayMs = 1500,
}: ConnectOptions = {}) => {
	let lastError: unknown;

	for (let attempt = 1; attempt <= retries; attempt += 1) {
		try {
			await prisma.$connect();
			return;
		} catch (error) {
			lastError = error;

			const isLastAttempt = attempt === retries;
			const errorMessage = formatConnectionError(error);

			console.error(
				`Prisma connection attempt ${attempt}/${retries} failed: ${errorMessage}`
			);

			if (isLastAttempt) {
				break;
			}

			await sleep(retryDelayMs);
		}
	}

	throw lastError;
};

export { connectPrismaWithRetry, prisma };