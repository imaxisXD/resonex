import { defineApp } from "convex/server";
import workpool from "@convex-dev/workpool/convex.config";
import resend from "@convex-dev/resend/convex.config";

const app = defineApp();
app.use(workpool, { name: "llmCallWorkpool" });
app.use(resend);

export default app;
