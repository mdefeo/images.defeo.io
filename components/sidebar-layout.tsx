"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SearchForm } from "@/components/search-form"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsOpen(false)
      }
    }

    checkMobile()

    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!isMobile) {
    return (
      <div className="flex h-screen">
        <div className="relative">
          <div
            className={`border-r bg-background h-full overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "w-80" : "w-0"
            }`}
          >
            {isOpen && (
              <div className="w-80 p-4 overflow-y-auto h-full">
                <h1 className="text-2xl font-bold">Pexels Image Search</h1>
                <p className="text-sm text-muted-foreground mb-4">Search for royalty-free images from Pexels</p>
                <SearchForm />
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className={`absolute top-4 shadow-md rounded-full ${isOpen ? "right-0 translate-x-1/2" : "left-4"}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-10 shadow-md">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="p-4 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold">Pexels Image Search</h1>
            <p className="text-sm text-muted-foreground mb-4">Search for royalty-free images from Pexels</p>
            <SearchForm />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 overflow-auto">
        <div className="p-6 pt-16">{children}</div>
      </div>
    </div>
  )
}

