import { z } from "zod";

export const ApiInput = z.object({
    topics: z.array(z.string().min(1)).min(1).max(50),
    minScore: z.number().min(0).max(1).optional().default(0.15)
});

export type ApiInput = z.infer<typeof ApiInput>;
