// Plain TypeScript types for User data
// The actual data is stored in .data/store.json via lib/db.ts

export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  role: "admin" | "reporter"
  createdAt: string
  updatedAt: string
}
