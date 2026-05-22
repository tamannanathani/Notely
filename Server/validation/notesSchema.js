import { z } from "zod";
export const noteSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty"),
  content: z.string().min(1, "Content cannot be empty"),
  summary: z.string().optional(),
  color: z.string().optional(),
  folderId: z.string().nullable().optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  isTrashed: z.boolean().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});
