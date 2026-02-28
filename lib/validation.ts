import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  // role field optional; only admin should create admin accounts
  role: z.enum(["admin", "reporter"]).optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
})

export const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").trim(),
  body: z.string().min(20, "Body must be at least 20 characters"),
  category: z.enum([
    "Technology",
    "Sports",
    "Politics",
    "Entertainment",
    "Science",
    "Health",
    "Business",
    "General",
  ]),
})

export const commentSchema = z.object({
  body: z.string().min(1, "Comment is required").trim(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type NewsInput = z.infer<typeof newsSchema>
export type CommentInput = z.infer<typeof commentSchema>
