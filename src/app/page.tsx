import { NhostClientProvider } from "@/components/nhost-provider"
import { VideoSummarizer } from "@/components/video-summarizer"

export default function Home() {
  return (
    <NhostClientProvider>
      <main className="min-h-screen bg-gray-50 py-12">
        <VideoSummarizer />
      </main>
    </NhostClientProvider>
  )
}

