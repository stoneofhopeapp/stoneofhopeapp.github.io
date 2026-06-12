import type { ReactNode } from 'react'
import type { VerseLine } from '../scriptureDisplay'

type CardTitleRowProps = {
  starred?: boolean
  children?: ReactNode
}

export function CardTitleRow({ starred = false, children }: CardTitleRowProps) {
  if (!children && !starred) return null

  return (
    <div className="soh-card-title-row">
      <div className="soh-card-title-row__main">{children}</div>
      {starred ? (
        <span className="soh-card-title-row__star" aria-label="Starred">
          🌟
        </span>
      ) : null}
    </div>
  )
}

type ScriptureReferenceProps = {
  reference: string | null
  inline?: boolean
}

export function ScriptureReference({ reference, inline = false }: ScriptureReferenceProps) {
  if (!reference) return null

  return (
    <p className={inline ? 'soh-scripture-ref soh-scripture-ref--inline' : 'soh-scripture-ref'}>
      {reference}
    </p>
  )
}

type NumberedVerseTextProps = {
  lines: VerseLine[]
  className?: string
}

export function NumberedVerseText({ lines, className }: NumberedVerseTextProps) {
  if (lines.length === 0) return null

  return (
    <p className={className ? `soh-numbered-verse ${className}` : 'soh-numbered-verse'}>
      {lines.map((line) => (
        <span key={`${line.number}-${line.text.slice(0, 24)}`} className="soh-numbered-verse__segment">
          {line.number > 0 ? (
            <span className="soh-verse-num" aria-label={`Verse ${line.number}`}>
              {line.number}{' '}
            </span>
          ) : null}
          {line.text}
          {' '}
        </span>
      ))}
    </p>
  )
}
