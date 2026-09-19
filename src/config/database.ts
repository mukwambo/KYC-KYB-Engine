import { PrismaClient } from "@prisma/client";
import { env } from "../environment";

// tsx/nodemon re-execute this module on every file change in dev, but the
// Node process (and any global it sets) survives the reload. Stashing the
// client on `global` keeps a hot-reloading dev server from opening a fresh
// pool of Postgres connections on every save.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

export const connectToDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log(
      "----------------------------✅ Connected to PostgreSQL----------------------------",
    );
  } catch (error) {
    console.error(
      "----------------------------❌ Error connecting to PostgreSQL:----------------------------",
      error,
    );
    process.exit(1);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error(
      "----------------------------❌ Error disconnecting from PostgreSQL:----------------------------",
      error,
    );
  }
};
