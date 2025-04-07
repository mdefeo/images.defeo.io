import { ImageResults } from "@/components/image-results"
import { Footer } from "@/components/footer"
import { SidebarLayout } from "@/components/sidebar-layout"

export default function Home() {
  return (
    <SidebarLayout>
      <div className="w-full">
        <ImageResults />
        <Footer />
      </div>
    </SidebarLayout>
  )
}

