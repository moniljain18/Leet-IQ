import { serve } from "inngest/express";
import { inngest, functions } from "../lib/inngest.js";

// create an API that Inngest can call
export const inngestApi = serve({
    client: inngest,
    functions,
});
