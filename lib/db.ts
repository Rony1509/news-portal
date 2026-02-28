import { randomUUID } from "crypto"
import fs from "fs"
import path from "path"

// File-based JSON data store — persists across server restarts
// Data is stored in a local JSON file so nothing is lost on reload.

const DATA_DIR = path.join(process.cwd(), ".data")
const DATA_FILE = path.join(DATA_DIR, "store.json")

// ── Types ──────────────────────────────────────────────────

export interface StoredUser {
  _id: string
  name: string
  email: string
  password: string
  role: "admin" | "reporter"
  createdAt: string
  updatedAt: string
}

export interface StoredComment {
  _id: string
  userId: string
  userName: string
  body: string
  createdAt: string
}

export interface StoredNews {
  _id: string
  title: string
  body: string
  category: string
  authorId: string
  authorName: string
  comments: StoredComment[]
  createdAt: string
  updatedAt: string
}

// ── Store shape ────────────────────────────────────────────

interface Store {
  users: StoredUser[]
  news: StoredNews[]
}

// ── Persistence helpers ────────────────────────────────────

function readStore(): Store {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8")
      return JSON.parse(raw) as Store
    }
  } catch {
    // If file is corrupted, start fresh
  }
  return { users: [], news: [] }
}

function writeStore(store: Store): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8")
}

function getStore(): Store {
  return readStore()
}

function saveStore(store: Store): void {
  writeStore(store)
}

// ── Helpers ────────────────────────────────────────────────

export function generateId(): string {
  return randomUUID()
}

// ── User operations ────────────────────────────────────────

export function findUserByEmail(email: string): StoredUser | undefined {
  return getStore().users.find((u) => u.email === email)
}

export function findUserById(id: string): StoredUser | undefined {
  return getStore().users.find((u) => u._id === id)
}

export function createUser(data: { name: string; email: string; password: string; role?: "admin" | "reporter" }): StoredUser {
  const store = getStore()
  const now = new Date().toISOString()
  const user: StoredUser = {
    _id: generateId(),
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role || "reporter",
    createdAt: now,
    updatedAt: now,
  }
  store.users.push(user)
  saveStore(store)
  return user
}

export function getAllUsersFromStore(): Omit<StoredUser, "password">[] {
  return getStore().users.map(({ password: _, ...rest }) => rest)
}

// ── News operations ────────────────────────────────────────

export function createNewsItem(data: {
  title: string
  body: string
  category: string
  authorId: string
  authorName: string
  comments?: StoredComment[]
}): StoredNews {
  const store = getStore()
  const now = new Date().toISOString()
  const news: StoredNews = {
    _id: generateId(),
    title: data.title,
    body: data.body,
    category: data.category,
    authorId: data.authorId,
    authorName: data.authorName,
    comments: data.comments ?? [],
    createdAt: now,
    updatedAt: now,
  }
  store.news.push(news)
  saveStore(store)
  return news
}

export function getAllNewsFromStore(category?: string): StoredNews[] {
  const store = getStore()
  let items = store.news
  if (category && category !== "All") {
    items = items.filter((n) => n.category === category)
  }
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function findNewsById(id: string): StoredNews | undefined {
  return getStore().news.find((n) => n._id === id)
}

export function updateNewsItem(
  id: string,
  data: Partial<{ title: string; body: string; category: string }>
): StoredNews | undefined {
  const store = getStore()
  const idx = store.news.findIndex((n) => n._id === id)
  if (idx === -1) return undefined
  store.news[idx] = {
    ...store.news[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  saveStore(store)
  return store.news[idx]
}

export function deleteNewsItem(id: string): boolean {
  const store = getStore()
  const idx = store.news.findIndex((n) => n._id === id)
  if (idx === -1) return false
  store.news.splice(idx, 1)
  saveStore(store)
  return true
}

export function addCommentToNews(
  newsId: string,
  comment: { userId: string; userName: string; body: string }
): StoredNews | undefined {
  const store = getStore()
  const idx = store.news.findIndex((n) => n._id === newsId)
  if (idx === -1) return undefined

  const newComment: StoredComment = {
    _id: generateId(),
    userId: comment.userId,
    userName: comment.userName,
    body: comment.body,
    createdAt: new Date().toISOString(),
  }

  store.news[idx].comments.push(newComment)
  store.news[idx].updatedAt = new Date().toISOString()
  saveStore(store)
  return store.news[idx]
}

// ── Reset (used by seed) ───────────────────────────────────

export function resetStore(): void {
  saveStore({ users: [], news: [] })
}
