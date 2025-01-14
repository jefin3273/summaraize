'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SocialShareData } from '@/types/summary'

interface ShareButtonProps {
  data: SocialShareData
}

export function ShareButton({ data }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async (platform: string) => {
    setIsSharing(true)
    try {
      switch (platform) {
        case 'native':
          if (navigator.share) {
            await navigator.share(data)
          }
          break
        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodeURIComponent(
              `${data.title}\n\n${data.text}\n\n${data.url}`
            )}`
          )
          break
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              data.url
            )}`
          )
          break
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `${data.title}\n${data.url}`
            )}`
          )
          break
      }
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={isSharing}>
          <Share className="h-4 w-4" />
          <span className="sr-only">Share summary</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare('native')}>
          Share...
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          Twitter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}