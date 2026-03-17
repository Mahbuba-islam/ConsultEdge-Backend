
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = Number(process.env.PORT) || 5000;

async function main() {
    try {
        await prisma.$connect();
        console.log("connected to database");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`server is running on port ${PORT}`);
        });

    } catch (err) {
        console.log(err);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();