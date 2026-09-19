import http from "http";
import app from "./src/app";
import { env } from "./src/environment";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "./src/config/database";
import { redisClient } from "./src/config/redis";
import { startVerificationWorker } from "./src/queues/verification.queue";

let httpServer: http.Server | undefined;
let verificationWorker: ReturnType<typeof startVerificationWorker> | undefined;

const startServer = async () => {
  try {
    await connectToDatabase();

    httpServer = http.createServer(app);
    verificationWorker = startVerificationWorker();

    httpServer.listen(env.PORT, () => {
      console.log(`✅ API listening on :${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = async () => {
  try {
    if (verificationWorker) await verificationWorker.close();
    if (httpServer) {
      await new Promise<void>((resolve) => httpServer!.close(() => resolve()));
    }
    redisClient.disconnect();
    await disconnectFromDatabase();
    process.exit(0);
  } catch (e) {
    console.error("Error during shutdown:", e);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown();
});
