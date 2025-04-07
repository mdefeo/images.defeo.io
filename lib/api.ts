import type { PhotosWithTotalResults } from "pexels"
import type { ImageResult } from "./types"

export interface SearchParams {
  query: string
  orientation: "all" | "square" | "landscape" | "portrait" | "wide"
  page?: number
  perPage?: number
  color?: string
}

export async function searchImages(params: SearchParams): Promise<{
  images: ImageResult[]
  totalResults: number
  nextPage: number | null
}> {
  const { query, orientation, page = 1, perPage = 15, color } = params

  try {
    const searchParams = new URLSearchParams()
    searchParams.set("query", query)
    if (orientation !== "all") searchParams.set("orientation", orientation)
    if (color && color !== "none") searchParams.set("color", color)
    searchParams.set("page", page.toString())
    searchParams.set("perPage", perPage.toString())

    const response = await fetch(`/api/images?${searchParams.toString()}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      images: data.images || [],
      totalResults: data.totalResults || 0,
      nextPage: data.nextPage,
    }
  } catch (error) {
    console.error("Error fetching images from Pexels:", error)
    throw error 
  }
}

export function mapPexelsResponse(photos: PhotosWithTotalResults): {
  images: ImageResult[]
  totalResults: number
  nextPage: number | null
} {
  const images = photos.photos.map((photo) => ({
    id: `pexels-${photo.id}`,
    description: photo.alt || photo.url.split("/").pop() || null,
    thumbnailUrl: photo.src.medium,
    sourceUrl: photo.url,
    author: photo.photographer,
    authorUrl: photo.photographer_url,
    source: "pexels" as const,
    licenseRequirements: ["Free to use", "Attribution not required", "Cannot be resold without modification"],
    width: photo.width,
    height: photo.height,
    color: photo.avg_color,
    originalUrl: photo.src.original,
    largeUrl: photo.src.large,
    smallUrl: photo.src.small,
  }))

  const nextPage = photos.page < Math.ceil(photos.total_results / photos.per_page) ? photos.page + 1 : null

  return {
    images,
    totalResults: photos.total_results,
    nextPage,
  }
}

