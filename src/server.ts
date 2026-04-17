import app from "./app";
import { envVars } from "./config/env";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { seedAdmin } from "./utilis/seed";
import { registerChatSocket } from "./modules/chat/chat.socket";
import { setChatWsHub, setSocketIO } from "./lib/socket";
import { ChatWsHub } from "./lib/chatWs";

const bootstrap = async() => {
    try {
        await seedAdmin();
        const httpServer = createServer(app);

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
    }
}

bootstrap();