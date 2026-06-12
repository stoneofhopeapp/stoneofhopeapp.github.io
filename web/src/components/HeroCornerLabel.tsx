type HeroCornerLabelProps = {
  label: string
  className?: string
}

/** Reusable hero cell label — sits top-right inside a `study-hero__card`. */
export function HeroCornerLabel({ label, className = '' }: HeroCornerLabelProps) {
  return (
    <span className={`hero-corner-label${className ? ` ${className}` : ''}`}>{label}</span>
  )
}
