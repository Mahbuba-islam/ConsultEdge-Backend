import app from "./app";
import { envVars } from "./config/env";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { seedAdmin } from "./utilis/seed";
import { registerChatSocket } from "./modules/chat/chat.socket";
import { setChatWsHub, setSocketIO } from "./lib/socket";
import { ChatWsHub } from "./lib/chatWs";
import { connectPrismaWithRetry, prisma } from "./lib/prisma";

const httpServer = createServer(app);

let isShuttingDown = false;

const shutdown = async (signal: string, exitCode = 0) => {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;
    console.log(`${signal} received. Shutting down gracefully...`);

    try {
        await new Promise<void>((resolve, reject) => {
            httpServer.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    } catch (error) {
        console.error("Failed to close HTTP server cleanly:", error);
        exitCode = 1;
    }

    try {
        await prisma.$disconnect();
    } catch (error) {
        console.error("Failed to disconnect Prisma cleanly:", error);
        exitCode = 1;
    }

    process.exit(exitCode);
};

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);

    if (envVars.NODE_ENV === "development") {
        return;
    }

    void shutdown("unhandledRejection", 1);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    void shutdown("uncaughtException", 1);
});

const bootstrap = async() => {
    try {
        await connectPrismaWithRetry({ retries: 5, retryDelayMs: 2000 });
        await seedAdmin();

        const io = new Server(httpServer, {
            cors: {
                origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
                credentials: true,
            },
        });

        setSocketIO(io);
        const wsHub = new ChatWsHub(httpServer);
        setChatWsHub(wsHub);
        registerChatSocket(io);

        httpServer.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        await prisma.$disconnect().catch(() => null);
    }
}

bootstrap();