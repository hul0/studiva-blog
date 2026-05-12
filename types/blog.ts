import { Document, Types } from "mongoose"

export interface IBlog {
  _id: string | Types.ObjectId
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  author: string
  tags: string[]
  category: string
  content: string
  readingTime: string
  views: number
  isPublished: boolean
  publishedAt: Date | string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type BlogDocument = IBlog & Document

export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface BlogListData {
  blogs: IBlog[]
  pagination?: PaginationData
  tags: string[]
  categories: string[]
  total: number
  totalPages: number
  page: number
}
