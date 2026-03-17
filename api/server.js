import {
  index_default,
  prisma
} from "./chunk-7BKPH2BP.js";

// src/server.ts
var PORT = Number(process.env.PORT) || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("connected to database");
    index_default.listen(PORT, "0.0.0.0", () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
