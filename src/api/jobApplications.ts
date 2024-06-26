import express from "express";
import {
  createJobApplication,
  getJobApplicationById,
  getJobApplications,
} from "../application/features/jobApplications";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import AuthorizationMiddleware from "./middlewares/authorization-middleware";

const jobApplicationsRouter = express.Router();
jobApplicationsRouter
  .route("/")
  .post(ClerkExpressRequireAuth({}), createJobApplication)
  // Viewing job applications can be done by only admin , so we pass the Authorization middleware to only give access to admin , check the middleware for details
  .get(ClerkExpressRequireAuth({}), AuthorizationMiddleware, getJobApplications);
jobApplicationsRouter
  .route("/:id")
  .get(ClerkExpressRequireAuth({}), AuthorizationMiddleware, getJobApplicationById);

export default jobApplicationsRouter;
