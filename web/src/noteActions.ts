import { formatScriptureRef, type BrowseItem } from './browseData'

export function buildNoteCopyText(item: BrowseItem): string {
  const parts: string[] = []
  const ref = formatScriptureRef(item)
  if (ref) parts.push(ref)
  if (item.verseText?.trim()) parts.push(item.verseText.trim())
  if (item.body?.trim()) parts.push(item.body.trim())
  return parts.join('\n\n')
}

export async function copyNoteToClipboard(item: BrowseItem): Promise<boolean> {
  const text = buildNoteCopyText(item)
  if (!text) return false

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
