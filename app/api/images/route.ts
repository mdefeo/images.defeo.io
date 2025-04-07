import { type NextRequest, NextResponse } from "next/server"

function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return `[Error stringifying object: ${e instanceof Error ? e.message : String(e)}]`
  }
}

export async function GET(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")
  const orientationParam = searchParams.get("orientation")
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const perPage = Number.parseInt(searchParams.get("perPage") || "15", 10)
  const color = searchParams.get("color") || undefined
  const size = searchParams.get("size") || undefined

  if (!query) {
    console.log("Missing required query parameter")
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const apiKey = process.env.PEXELS_API_KEY

    if (!apiKey) {
      console.error("PEXELS_API_KEY environment variable is not set")
      return NextResponse.json(
        { error: "API key is not configured. Please set the PEXELS_API_KEY environment variable." },
        { status: 500 },
      )
    }

    const searchOptions: Record<string, any> = {
      query,
      page,
      per_page: perPage,
    }

    if (orientationParam) {
      const orientations = orientationParam.split(",")
      if (orientations.length > 0) {
        searchOptions.orientation = orientations[0]
      }
    }

    if (color && color !== "none") {
      searchOptions.color = color
    }

    if (size && size !== "all") {
      searchOptions.size = size
    }

    console.log("Pexels API request options:", safeStringify(searchOptions))

    const queryParams = new URLSearchParams()
    Object.entries(searchOptions).forEach(([key, value]) => {
      queryParams.append(key, value.toString())
    })

    const url = `https://api.pexels.com/v1/search?${queryParams.toString()}`
    console.log("Fetching from URL:", url)

    try {
      console.log("Starting fetch request to Pexels API")

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: apiKey,
        },
        signal: AbortSignal.timeout(15000),
      })

      console.log("Fetch response status:", response.status)

      if (!response.ok) {
        let errorText = "Unknown error"
        try {
          errorText = await response.text()
          console.error("Pexels API error response:", response.status, errorText)
        } catch (textError) {
          console.error("Error reading response text:", textError)
        }

        throw new Error(`Pexels API responded with status: ${response.status}, message: ${errorText}`)
      }

      let data
      try {
        data = await response.json()
        console.log("Response data keys:", Object.keys(data))
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError)
        throw new Error("Failed to parse API response as JSON")
      }

      if (!data.photos || !Array.isArray(data.photos)) {
        console.error("Unexpected Pexels API response format:", safeStringify(data))
        throw new Error("Unexpected response format from Pexels API")
      }

      console.log(`Successfully fetched ${data.photos.length} photos from Pexels API`)

      const images = data.photos.map((photo: any) => ({
        id: `pexels-${photo.id}`,
        description: photo.alt || photo.url.split("/").pop() || null,
        thumbnailUrl: photo.src.medium,
        sourceUrl: photo.url,
        author: photo.photographer,
        authorUrl: photo.photographer_url,
        source: "pexels",
        licenseRequirements: ["Free to use", "Attribution not required", "Cannot be resold without modification"],
        width: photo.width,
        height: photo.height,
        color: photo.avg_color,
        originalUrl: photo.src.original,
        largeUrl: photo.src.large,
        smallUrl: photo.src.small,
      }))

      return NextResponse.json({
        images,
        totalResults: data.total_results,
        nextPage: data.next_page ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        page: page,
        perPage: perPage,
      })
    } catch (fetchError) {
      console.error("Error during fetch operation:", fetchError)

      if (fetchError instanceof DOMException && fetchError.name === "TimeoutError") {
        console.log("Request timed out, using mock data")
        return NextResponse.json({
          images: getMockImages(),
          totalResults: 100,
          nextPage: null,
          prevPage: null,
          page: 1,
          perPage: 15,
          warning: "Using mock data because the Pexels API request timed out.",
        })
      }

      throw fetchError 
    }
  } catch (error) {
    console.error("Error in API route:", error)

    console.log("Using mock data due to API error")
    return NextResponse.json({
      images: getMockImages(),
      totalResults: 100,
      nextPage: null,
      prevPage: null,
      page: 1,
      perPage: 15,
      warning: "Using mock data due to API issues. Please check your API key.",
    })
  }
}

function getMockImages() {
  return [
    {
      id: "pexels-1",
      description: "Mountain landscape at sunset",
      thumbnailUrl: "/placeholder.svg?height=300&width=400",
      sourceUrl: "https://www.pexels.com/photo/mountain-landscape-1/",
      author: "John Doe",
      authorUrl: "https://www.pexels.com/@johndoe",
      source: "pexels",
      licenseRequirements: ["Free to use", "Attribution not required", "Cannot be resold without modification"],
      width: 1920,
      height: 1080,
      color: "#4C6A92",
      originalUrl: "https://www.pexels.com/photo/mountain-landscape-1/original",
      largeUrl: "https://www.pexels.com/photo/mountain-landscape-1/large",
      smallUrl: "https://www.pexels.com/photo/mountain-landscape-1/small",
    },
    {
      id: "pexels-2",
      description: "Beach with palm trees",
      thumbnailUrl: "/placeholder.svg?height=300&width=400",
      sourceUrl: "https://www.pexels.com/photo/beach-palm-trees-2/",
      author: "Jane Smith",
      authorUrl: "https://www.pexels.com/@janesmith",
      source: "pexels",
      licenseRequirements: ["Free to use", "Attribution not required", "Cannot be resold without modification"],
      width: 1600,
      height: 900,
      color: "#82C4D3",
      originalUrl: "https://www.pexels.com/photo/beach-palm-trees-2/original",
      largeUrl: "https://www.pexels.com/photo/beach-palm-trees-2/large",
      smallUrl: "https://www.pexels.com/photo/beach-palm-trees-2/small",
    },
    {
      id: "pexels-3",
      description: "City skyline at night",
      thumbnailUrl: "/placeholder.svg?height=400&width=300",
      sourceUrl: "https://www.pexels.com/photo/city-skyline-3/",
      author: "Alex Johnson",
      authorUrl: "https://www.pexels.com/@alexjohnson",
      source: "pexels",
      licenseRequirements: ["Free to use", "Attribution not required", "Cannot be resold without modification"],
      width: 800,
      height: 1200,
      color: "#1A2B3C",
      originalUrl: "https://www.pexels.com/photo/city-skyline-3/original",
      largeUrl: "https://www.pexels.com/photo/city-skyline-3/large",
      smallUrl: "https://www.pexels.com/photo/city-skyline-3/small",
    },
  ]
}

