import Ably from "ably";

import { envVars } from "../config/env";

let ablyClient: Ably.Rest | null = null;

const getAblyClient = (): Ably.Rest | null => {
  if (!envVars.ABLY_API_KEY) {
    return null;
  }

  if (!ablyClient) {
    ablyClient = new Ably.Rest({ key: envVars.ABLY_API_KEY });
  }

  return ablyClient;
};

/**
 * Channel naming conventions:
 *   private-room-<roomId>     -> per chat room
 *   private-user-<userId>     -> per recipient direct fan-out
 */
export const roomChannel = (roomId: string) => `private-room-${roomId}`;
export const userChannel = (userId: string) => `private-user-${userId}`;

export const publishToRoom = async (
  roomId: string,
  eventName: string,
  payload: unknown
) => {
  const client = getAblyClient();
  if (!client) return;

  try {
    await client.channels.get(roomChannel(roomId)).publish(eventName, payload);
  } catch (error) {
    console.error("Ably publishToRoom failed:", error);
  }
};

export const publishToUser = async (
  userId: string,
  eventName: string,
  payload: unknown
) => {
  const client = getAblyClient();
  if (!client) return;

  try {
    await client.channels.get(userChannel(userId)).publish(eventName, payload);
  } catch (error) {
    console.error("Ably publishToUser failed:", error);
  }
};

/**
 * Generates a short-lived Ably token that the frontend uses to subscribe.
 * Frontend should call: GET /api/v1/realtime/token (auth required)
 */
export const createAblyTokenRequest = async (
  clientId: string,
  capability: Record<string, string[]>
) => {
  const client = getAblyClient();
  if (!client) {
    throw new Error("Ably is not configured. Set ABLY_API_KEY.");
  }

  return client.auth.createTokenRequest({
    clientId,
    capability,
    ttl: 60 * 60 * 1000,
  });
};
