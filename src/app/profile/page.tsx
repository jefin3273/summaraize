'use client'

import { useUserData } from '@nhost/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProfilePage() {
  const user = useUserData()

  if (!user) return null

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl || ''} alt={user.displayName || user.email} />
              <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.displayName || 'User Profile'}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Account Details</h3>
              <p className="text-sm text-muted-foreground">
                ID: {user.id}
              </p>
              <p className="text-sm text-muted-foreground">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

