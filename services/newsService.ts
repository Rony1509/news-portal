import {
  createNewsItem,
  getAllNewsFromStore,
  findNewsById,
  updateNewsItem,
  deleteNewsItem,
  addCommentToNews,
} from "@/lib/db"
import type { NewsInput, CommentInput } from "@/lib/validation"

// News service — backed by local file store

export async function createNews(
  input: NewsInput,
  authorId: string,
  authorName: string
) {
  return createNewsItem({
    title: input.title,
    body: input.body,
    category: input.category,
    authorId,
    authorName,
  })
}

export async function getAllNews(category?: string) {
  return getAllNewsFromStore(category)
}

export async function getNewsById(id: string) {
  const news = findNewsById(id)
  if (!news) throw new Error("News not found")
  return news
}

export async function updateNews(
  id: string,
  input: Partial<NewsInput>,
  userId: string
) {
  const news = findNewsById(id)
  if (!news) throw new Error("News not found")
  if (news.authorId !== userId) {
    throw new Error("Unauthorized: Only the author can edit this news")
  }

  const updated = updateNewsItem(id, input)
  if (!updated) throw new Error("News not found")
  return updated
}

export async function deleteNews(id: string, userId: string) {
  const news = findNewsById(id)
  if (!news) throw new Error("News not found")
  if (news.authorId !== userId) {
    throw new Error("Unauthorized: Only the author can delete this news")
  }

  deleteNewsItem(id)
  return { message: "News deleted successfully" }
}

export async function addComment(
  newsId: string,
  input: CommentInput,
  userId: string,
  userName: string
) {
  const news = findNewsById(newsId)
  if (!news) throw new Error("News not found")

  const updated = addCommentToNews(newsId, {
    userId,
    userName,
    body: input.body,
  })
  if (!updated) throw new Error("News not found")
  return updated
}
