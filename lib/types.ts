export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  category_id: string | null
  featured_image: string | null
  published: boolean
  published_at: string | null
  views: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface Ad {
  id: string
  name: string
  position: "header" | "sidebar" | "footer" | "in-article"
  code: string
  active: boolean
  created_at: string
  updated_at: string
}
