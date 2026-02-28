import bcrypt from "bcryptjs"
import { findUserByEmail, createUser, getAllUsersFromStore } from "@/lib/db"
import { signToken } from "@/lib/auth"
import type { RegisterInput, LoginInput } from "@/lib/validation"

export async function registerUser(input: RegisterInput) {
  const existingUser = findUserByEmail(input.email)
  if (existingUser) {
    throw new Error("Email already registered")
  }

  const hashedPassword = await bcrypt.hash(input.password, 12)

  const user = createUser({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    role: input.role, // will default to reporter if undefined
  })

  const token = signToken({
    userId: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

export async function loginUser(input: LoginInput) {
  const user = findUserByEmail(input.email)
  if (!user) {
    throw new Error("Invalid email or password")
  }

  const isMatch = await bcrypt.compare(input.password, user.password)
  if (!isMatch) {
    throw new Error("Invalid email or password")
  }

  const token = signToken({
    userId: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

export async function getAllUsers() {
  return getAllUsersFromStore()
}
