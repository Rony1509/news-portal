// Plain TypeScript types for News data
// The actual data is stored in .data/store.json via lib/db.ts

export interface IComment {
  _id: string
  userId: string
  userName: string
  body: string
  createdAt: string
}

export interface INews {
  _id: string
  title: string
  body: string
  category: string
  authorId: string
  authorName: string
  comments: IComment[]
  createdAt: string
  updatedAt: string
}
