"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Info, User, Download, AlertCircle, RefreshCw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ImageResult } from "@/lib/types"

export function ImageResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query")
  const orientationParam = searchParams.get("orientation")
  const color = searchParams.get("color")
  const size = searchParams.get("size")
  const page = Number.parseInt(searchParams.get("page") || "1", 10)

  const orientations = orientationParam ? orientationParam.split(",") : []

  const [results, setResults] = useState<ImageResult[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)
      setWarning(null)

      try {
        const params = new URLSearchParams()
        params.set("query", query)
        if (orientationParam) params.set("orientation", orientationParam)
        if (color && color !== "none") params.set("color", color)
        if (size && size !== "all") params.set("size", size)
        params.set("page", "1")
        params.set("perPage", "15")

        const response = await fetch(`/api/images?${params.toString()}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(errorData.error || `API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.warning) {
          setWarning(data.warning)
        }

        setResults(data.images || [])
        setTotalResults(data.totalResults || 0)
        setNextPage(data.nextPage)
      } catch (err) {
        console.error("Error fetching images:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch images. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [query, orientationParam, color, size, retryCount])

  async function loadMoreResults() {
    if (!nextPage || !query) return

    setIsLoadingMore(true)

    try {
      const params = new URLSearchParams()
      params.set("query", query)
      if (orientationParam) params.set("orientation", orientationParam)
      if (color && color !== "none") params.set("color", color)
      if (size && size !== "all") params.set("size", size)
      params.set("page", nextPage.toString())
      params.set("perPage", "15")

      const response = await fetch(`/api/images?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.warning && !warning) {
        setWarning(data.warning)
      }

      setResults((prev) => [...prev, ...(data.images || [])])
      setNextPage(data.nextPage)
    } catch (err) {
      console.error("Error fetching more images:", err)
      setError(err instanceof Error ? err.message : "Failed to load more images. Please try again.")
    } finally {
      setIsLoadingMore(false)
    }
  }

  function handleRetry() {
    setRetryCount((prev) => prev + 1)
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Enter a search term to find images</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div className="mt-6 text-center">
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>

          <p className="mt-4 text-muted-foreground">
            If this error persists, the Pexels API might be temporarily unavailable or your API key might be incorrect.
          </p>
        </div>
      </div>
    )
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No images found for "{query}". Try a different search term.</p>
      </div>
    )
  }

  const orientationDisplay =
    orientations.length > 0 ? orientations.map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(", ") : "Any"

  return (
    <div>
      {warning && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            {warning}
            <Button onClick={handleRetry} variant="link" className="p-0 h-auto ml-2">
              Retry with Pexels API
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <h2 className="text-xl font-semibold mb-4">
        Search Results for "{query}"
        <span className="text-sm font-normal text-muted-foreground ml-2">
          ({results.length} of {totalResults.toLocaleString()} images)
        </span>
      </h2>

      {orientations.length > 0 && (
        <p className="text-sm text-muted-foreground mb-4">Orientation: {orientationDisplay}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((image) => (
          <Card key={image.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative h-48 bg-muted cursor-pointer" onClick={() => setSelectedImage(image)}>
              {/* Fix for image loading - use unoptimized for external URLs */}
              <Image
                src={image.thumbnailUrl || "/placeholder.svg"}
                alt={image.description || "Image"}
                fill
                unoptimized={!image.thumbnailUrl.startsWith("/")}
                className="object-cover transition-transform hover:scale-105"
              />
              {image.color && (
                <div
                  className="absolute bottom-2 left-2 w-6 h-6 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: image.color }}
                  title={`Average color: ${image.color}`}
                />
              )}
              <Badge className="absolute top-2 right-2 capitalize" variant="secondary">
                Pexels
              </Badge>
            </div>

            <CardContent className="p-4 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium truncate">{image.description || "Untitled Image"}</p>
                  <Link
                    href={image.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
                  >
                    <User className="h-3 w-3" />
                    {image.author}
                  </Link>
                </div>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                      <span className="sr-only">License Info</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">License Requirements</h4>
                      <ul className="text-sm space-y-1">
                        {image.licenseRequirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Link href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="outline" className="w-full">
                  View on Pexels
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {nextPage && (
        <div className="mt-8 text-center">
          <Button onClick={loadMoreResults} disabled={isLoadingMore} variant="outline" size="lg">
            {isLoadingMore ? "Loading more..." : "Load More Images"}
          </Button>
        </div>
      )}

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedImage.description || "Image Details"}</DialogTitle>
                <DialogDescription>
                  Photo by{" "}
                  <Link href={selectedImage.authorUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    {selectedImage.author}
                  </Link>{" "}
                  on{" "}
                  <Link href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline">
                    Pexels
                  </Link>
                </DialogDescription>
              </DialogHeader>
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image
                  src={selectedImage.largeUrl || "/placeholder.svg"}
                  alt={selectedImage.description || "Image"}
                  fill
                  unoptimized={!selectedImage.largeUrl.startsWith("/")}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {selectedImage.width} × {selectedImage.height} pixels
                </div>
                <div className="flex gap-2">
                  <Link href={selectedImage.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      View on Pexels
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={selectedImage.originalUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm">
                      Download
                      <Download className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

