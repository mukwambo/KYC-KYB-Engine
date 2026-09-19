import express, { Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes";
import errorHandler from "./middlewares/errorHandler";
import { limiter } from "./middlewares/rateLimiter";

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(morgan("tiny"));

// KYC/KYB providers commonly sign webhooks over the raw request body. When a
// webhook route is added, mount express.raw({ type: "application/json" }) on
// that specific path ahead of express.json() below, or the signature check
// will be validated against the re-serialized (and non-identical) body.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

app.use("/api", router);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "KYC-KYB-Engine" });
});

app.use(errorHandler);

export default app;
