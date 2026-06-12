import {
  browseItemKindLabels,
  browseKindFilterOrder,
  type BrowseItemKind,
} from '../browseData'
import { BrowseKindBadge } from './ContentKindBadge'

type BrowseKindFilterProps = {
  selected: BrowseItemKind | null
  onChange: (kind: BrowseItemKind | null) => void
}

export function BrowseKindFilter({ selected, onChange }: BrowseKindFilterProps) {
  const select = (kind: BrowseItemKind) => {
    onChange(selected === kind ? null : kind)
  }

  return (
    <div className="browse-kind-filter" role="tablist" aria-label="Filter by type">
      {browseKindFilterOrder.map((kind) => {
        const isActive = selected === kind
        return (
          <button
            key={kind}
            type="button"
            role="tab"
            className={`browse-kind-filter__btn${isActive ? ' is-active' : ''}`}
            aria-selected={isActive}
            onClick={() => select(kind)}
          >
            <BrowseKindBadge kind={kind} label={browseItemKindLabels[kind]} />
          </button>
        )
      })}
    </div>
  )
}
