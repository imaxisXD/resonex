import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Generate recommendations daily at 2 AM
crons.cron(
  "generate recommendations",
  "0 2 * * *", // Daily at 2 AM
  internal.recommendations.generateAllRecommendations,
  {},
);

export default crons;
