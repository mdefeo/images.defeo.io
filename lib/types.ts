export interface ImageResult {
  id: string
  description: string | null
  thumbnailUrl: string
  sourceUrl: string
  author: string
  authorUrl: string
  source: "pexels"
  licenseRequirements: string[]
  width: number
  height: number
  color?: string
  originalUrl: string
  largeUrl: string
  smallUrl: string
}

export interface PexelsResponse {
  total_results: number
  page: number
  per_page: number
  photos: PexelsPhoto[]
  next_page: string
}

export interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  avg_color: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  liked: boolean
  alt: string
}

