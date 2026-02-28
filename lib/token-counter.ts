export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4)
}

export function formatTokenCount(count: number): string {
  if (count < 1000) return `${count}`
  return `${(count / 1000).toFixed(1)}k`
}
