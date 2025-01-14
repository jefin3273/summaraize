'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History } from 'lucide-react'
import { ShareButton } from './share-button'
import { Summary } from '@/types/summary'

interface SummaryHistoryProps {
  summaries: Summary[]
}

export function SummaryHistory({ summaries }: SummaryHistoryProps) {
  if (summaries.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Past Summaries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summaries.map((sum) => (
            <Card key={sum.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <a
                    href={sum.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {sum.video_url}
                  </a>
                  <ShareButton
                    data={{
                      title: "Video Summary",
                      text: sum.summary,
                      url: sum.video_url
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{sum.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}