import { Router } from "express";

const v1Routes = Router();

// Mount feature-module routers here as they're added, following the
// modules/<name>/<name>.routes.ts convention, e.g.:
//
//   import kycRouter from "../modules/kyc/kyc.routes";
//   v1Routes.use("/kyc", kycRouter);

export default v1Routes;
