import { NhostClientProvider } from "@/components/nhost-provider"
import { AuthPage } from "@/components/auth-page"

export default function Auth() {
  return (
    <NhostClientProvider>
      <AuthPage />
    </NhostClientProvider>
  )
}

