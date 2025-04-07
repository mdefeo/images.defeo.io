"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const colorOptions = [
  { value: "none", label: "Any Color" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "turquoise", label: "Turquoise" },
  { value: "blue", label: "Blue" },
  { value: "violet", label: "Violet" },
  { value: "pink", label: "Pink" },
  { value: "brown", label: "Brown" },
  { value: "black", label: "Black" },
  { value: "gray", label: "Gray" },
  { value: "white", label: "White" },
]

const sizeOptions = [
  { value: "all", label: "Any Size" },
  { value: "large", label: "Large (24MP)" },
  { value: "medium", label: "Medium (12MP)" },
  { value: "small", label: "Small (4MP)" },
]

const orientationOptions = [
  { value: "square", label: "Square" },
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
]

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const initialOrientationParam = searchParams.get("orientation") || ""
  const initialOrientations = initialOrientationParam ? initialOrientationParam.split(",") : []

  const [formState, setFormState] = useState({
    query: searchParams.get("query") || "",
    color: searchParams.get("color") || "none",
    size: searchParams.get("size") || "all",
  })

  const [selectedOrientations, setSelectedOrientations] = useState<string[]>(initialOrientations)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleOrientationChange = (orientation: string, checked: boolean) => {
    if (checked) {
      setSelectedOrientations((prev) => [...prev, orientation])
    } else {
      setSelectedOrientations((prev) => prev.filter((o) => o !== orientation))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const params = new URLSearchParams()

    if (formState.query) {
      params.set("query", formState.query)
    }

    if (selectedOrientations.length > 0) {
      params.set("orientation", selectedOrientations.join(","))
    }

    if (formState.color && formState.color !== "none") {
      params.set("color", formState.color)
    }

    if (formState.size && formState.size !== "all") {
      params.set("size", formState.size)
    }

    router.push(`/?${params.toString()}`)

    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="query">Search Keywords</Label>
        <div className="relative mt-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="query"
            name="query"
            placeholder="e.g. nature, city, people..."
            className="pl-8"
            value={formState.query}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Image Orientation</Label>
          <div className="space-y-2">
            {orientationOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`orientation-${option.value}`}
                  checked={selectedOrientations.includes(option.value)}
                  onCheckedChange={(checked) => handleOrientationChange(option.value, checked === true)}
                />
                <Label htmlFor={`orientation-${option.value}`} className="font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="color">Color</Label>
          <Select value={formState.color} onValueChange={(value) => handleSelectChange("color", value)}>
            <SelectTrigger id="color" className="mt-1">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="size">Image Size</Label>
          <Select value={formState.size} onValueChange={(value) => handleSelectChange("size", value)}>
            <SelectTrigger id="size" className="mt-1">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search Images"}
      </Button>
    </form>
  )
}

