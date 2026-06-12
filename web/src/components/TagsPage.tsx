import { useEffect, useMemo, useState } from 'react'
import {
  browseTags,
  countItemsForTag,
  filterBrowseItemsByKind,
  getItemsForTag,
  openTagsRoute,
  readTagsRouteFromHash,
  type BrowseItem,
  type BrowseItemKind,
  type TagsRoute,
} from '../browseData'
import { BrowseItemCard } from './BrowseItemCard'
import { BrowseKindFilter } from './BrowseKindFilter'
import { BibleBooksPanel } from './BibleBooksPanel'

const tagNameMap = Object.fromEntries(browseTags.map((tag) => [tag.id, tag.name]))

type ItemListProps = {
  items: BrowseItem[]
  showTags?: boolean
  kindFilter: BrowseItemKind | null
  onKindFilterChange: (kind: BrowseItemKind | null) => void
  resultsTitle?: string
  resultsMeta?: string
}

function ItemList({
  items,
  showTags = false,
  kindFilter,
  onKindFilterChange,
  resultsTitle,
  resultsMeta,
}: ItemListProps) {
  const filteredItems = useMemo(
    () => filterBrowseItemsByKind(items, kindFilter),
    [items, kindFilter],
  )

  return (
    <>
      {resultsTitle ? (
        <div className="library-results-header">
          <div>
            <h2>{resultsTitle}</h2>
            {resultsMeta ? <p className="library-panel__meta">{resultsMeta}</p> : null}
          </div>
          <BrowseKindFilter selected={kindFilter} onChange={onKindFilterChange} />
        </div>
      ) : null}

      {filteredItems.length === 0 ? (
        <p className="library-empty">Nothing here for this type.</p>
      ) : (
        <div className="library-item-list">
          {filteredItems.map((item) => (
            <BrowseItemCard key={item.id} item={item} showTags={showTags} tagNames={tagNameMap} />
          ))}
        </div>
      )}
    </>
  )
}

function TagsPanel({
  selectedTagId,
  kindFilter,
  onKindFilterChange,
}: {
  selectedTagId?: string
  kindFilter: BrowseItemKind | null
  onKindFilterChange: (kind: BrowseItemKind | null) => void
}) {
  const items = selectedTagId ? getItemsForTag(selectedTagId) : []
  const selectedTag = selectedTagId ? browseTags.find((tag) => tag.id === selectedTagId) : null
  const filteredCount = filterBrowseItemsByKind(items, kindFilter).length

  return (
    <div className="library-tags">
      <div className="library-tags__picker">
        <p className="library-panel__hint">Browse by theme — not full-text search.</p>
        <div className="library-tag-grid" role="list">
          {browseTags.map((tag) => {
            const count = countItemsForTag(tag.id)
            const isActive = tag.id === selectedTagId

            return (
              <button
                key={tag.id}
                type="button"
                role="listitem"
                className={`library-tag-chip${isActive ? ' is-active' : ''}`}
                onClick={() => openTagsRoute({ view: 'tags', tagId: tag.id })}
              >
                <span className="library-tag-chip__name">{tag.name}</span>
                <span className="library-tag-chip__count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="library-tags__results">
        {selectedTag ? (
          <ItemList
            items={items}
            kindFilter={kindFilter}
            onKindFilterChange={onKindFilterChange}
            resultsTitle={selectedTag.name}
            resultsMeta={`${filteredCount} of ${items.length} items`}
          />
        ) : (
          <p className="library-empty">Select a tag to see notes, prayers, and verses.</p>
        )}
      </div>
    </div>
  )
}

export function TagsPage() {
  const [route, setRoute] = useState<TagsRoute>(() => readTagsRouteFromHash())
  const [tagsKindFilter, setTagsKindFilter] = useState<BrowseItemKind | null>(null)

  useEffect(() => {
    const sync = () => setRoute(readTagsRouteFromHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const mode = route.view
  const selectedTagId = route.view === 'tags' && 'tagId' in route ? route.tagId : undefined
  const bookOrd = route.view === 'bible' && 'bookOrd' in route ? route.bookOrd : undefined

  useEffect(() => {
    setTagsKindFilter(null)
  }, [selectedTagId])

  return (
    <main className="library-shell">
      <header className="library-header">
        <div className="library-mode-toggle" role="tablist" aria-label="Browse mode">
          <button
            type="button"
            role="tab"
            className={`library-mode-toggle__btn${mode === 'tags' ? ' is-active' : ''}`}
            aria-selected={mode === 'tags'}
            onClick={() => {
              setTagsKindFilter(null)
              openTagsRoute({ view: 'tags', tagId: selectedTagId })
            }}
          >
            By Tags
          </button>
          <button
            type="button"
            role="tab"
            className={`library-mode-toggle__btn${mode === 'bible' ? ' is-active' : ''}`}
            aria-selected={mode === 'bible'}
            onClick={() => {
              openTagsRoute(bookOrd != null ? { view: 'bible', bookOrd } : { view: 'bible' })
            }}
          >
            By Bible Books
          </button>
        </div>
      </header>

      <section className="library-panel">
        {mode === 'tags' ? (
          <TagsPanel
            selectedTagId={selectedTagId}
            kindFilter={tagsKindFilter}
            onKindFilterChange={setTagsKindFilter}
          />
        ) : (
          <BibleBooksPanel bookOrd={bookOrd} />
        )}
      </section>
    </main>
  )
}
