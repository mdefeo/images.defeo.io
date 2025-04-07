import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-12 border-t py-6">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Link
          href="https://www.pexels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Image
            src="https://images.pexels.com/lib/api/pexels.png"
            alt="Pexels Logo"
            width={100}
            height={25}
            className="h-6 w-auto"
          />
        </Link>
        <p className="text-sm text-muted-foreground">
          Photos provided by{" "}
          <Link
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Pexels
          </Link>
        </p>
      </div>
    </footer>
  )
}

