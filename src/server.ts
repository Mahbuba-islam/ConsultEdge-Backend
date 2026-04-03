import app from "./app";
import { envVars } from "./config/env";

import { seedAdmin } from "./utilis/seed";

const bootstrap = async() => {
    try {
        await seedAdmin();
        app.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

bootstrap();