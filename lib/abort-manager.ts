export class AbortManager {
  private controller: AbortController | null = null

  start(): AbortSignal {
    this.abort()
    this.controller = new AbortController()
    return this.controller.signal
  }

  abort(): void {
    if (this.controller) {
      this.controller.abort()
      this.controller = null
    }
  }

  get signal(): AbortSignal | null {
    return this.controller?.signal || null
  }
}
