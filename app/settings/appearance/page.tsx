'use client'

import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AppearancePage() {
  return (
    <SettingsLayout>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Theme settings coming soon</p>
        </CardContent>
      </Card>
    </SettingsLayout>
  )
}
