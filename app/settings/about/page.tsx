'use client'

import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <SettingsLayout>
      <Card>
        <CardHeader>
          <CardTitle>About NexusChat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Version</h3>
            <p className="text-muted-foreground">1.0.0</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              Full-featured AI chat application with BYOK (Bring Your Own Key) architecture.
              Connect your own API keys from any OpenAI-compatible provider.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Supported Providers</h3>
            <p className="text-muted-foreground">
              OpenAI, Anthropic, Google AI, Groq, OpenRouter, Together AI, Mistral, Cohere,
              DeepSeek, xAI Grok, Perplexity, Fireworks AI, Ollama, LM Studio, and custom
              providers.
            </p>
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  )
}
