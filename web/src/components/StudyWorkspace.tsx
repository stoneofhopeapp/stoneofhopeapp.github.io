import { useEffect, useMemo, useState } from 'react'
import type { SessionUser } from '../session'
import {
  featuredBook,
  featuredBookScriptureByChapterId,
  type StudyChapter,
} from '../studyData'

type StudyNoteComment = {
  id: string
  body: string
  updatedAt: string
}

type StudyVerseNote = {
  id: string
  chapterId: string
  verseOrd: number
  body: string
  updatedAt: string
  comments: StudyNoteComment[]
}

type WorkspaceState = {
  lastChapterId: string
  completedChapterIds: string[]
  notes: StudyVerseNote[]
}

type StudyWorkspaceProps = {
  user: SessionUser
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

const DEFAULT_CHAPTER_ID = featuredBook.chapters[0]?.id ?? ''

function storageKey(uid: string) {
  return `stone-of-hope.study.${uid}.${featuredBook.id}`
}

function createDefaultState(): WorkspaceState {
  return {
    lastChapterId: DEFAULT_CHAPTER_ID,
    completedChapterIds: [],
    notes: [],
  }
}

function normalizeNote(note: unknown): StudyVerseNote | null {
  if (!note || typeof note !== 'object') return null

  const candidate = note as {
    id?: unknown
    chapterId?: unknown
    verseOrd?: unknown
    body?: unknown
    updatedAt?: unknown
    comments?: unknown
  }

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.chapterId !== 'string' ||
    typeof candidate.verseOrd !== 'number' ||
    typeof candidate.body !== 'string' ||
    typeof candidate.updatedAt !== 'string' ||
    !Array.isArray(candidate.comments)
  ) {
    return null
  }

  return {
    id: candidate.id,
    chapterId: candidate.chapterId,
    verseOrd: candidate.verseOrd,
    body: candidate.body,
    updatedAt: candidate.updatedAt,
    comments: candidate.comments.filter(
      (comment): comment is StudyNoteComment =>
        typeof comment?.id === 'string' &&
        typeof comment.body === 'string' &&
        typeof comment.updatedAt === 'string',
    ),
  }
}

function loadWorkspaceState(uid: string): WorkspaceState {
  const raw = window.localStorage.getItem(storageKey(uid))
  if (!raw) return createDefaultState()

  try {
    const parsed = JSON.parse(raw) as Partial<WorkspaceState>
    return {
      lastChapterId:
        typeof parsed.lastChapterId === 'string' && parsed.lastChapterId
          ? parsed.lastChapterId
          : DEFAULT_CHAPTER_ID,
      completedChapterIds: Array.isArray(parsed.completedChapterIds)
        ? parsed.completedChapterIds.filter((value): value is string => typeof value === 'string')
        : [],
      notes: Array.isArray(parsed.notes)
        ? parsed.notes
            .map((note) => normalizeNote(note))
            .filter((note): note is StudyVerseNote => note !== null)
        : [],
    }
  } catch {
    return createDefaultState()
  }
}

function saveWorkspaceState(uid: string, state: WorkspaceState) {
  window.localStorage.setItem(storageKey(uid), JSON.stringify(state))
}

export function StudyWorkspace({ user, theme, onToggleTheme }: StudyWorkspaceProps) {
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>(() =>
    loadWorkspaceState(user.uid),
  )
  const [draftVerseOrd, setDraftVerseOrd] = useState<number | null>(null)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [draftBody, setDraftBody] = useState('')
  const [replyingToNoteId, setReplyingToNoteId] = useState<string | null>(null)
  const [commentDraft, setCommentDraft] = useState('')
  const [expandedNoteIds, setExpandedNoteIds] = useState<string[]>([])

  useEffect(() => {
    saveWorkspaceState(user.uid, workspaceState)
  }, [user.uid, workspaceState])

  const activeChapter =
    featuredBook.chapters.find((chapter) => chapter.id === workspaceState.lastChapterId) ??
    featuredBook.chapters[0]

  const activeScriptureSet = featuredBookScriptureByChapterId[activeChapter.id]
  const activeScripture = activeScriptureSet?.primary
  const secondaryScripture = activeScriptureSet?.secondary

  const chapterNotes = useMemo(
    () =>
      workspaceState.notes
        .filter((note) => note.chapterId === activeChapter.id)
        .sort((a, b) => {
          if (a.verseOrd !== b.verseOrd) return a.verseOrd - b.verseOrd
          return b.updatedAt.localeCompare(a.updatedAt)
        }),
    [activeChapter.id, workspaceState.notes],
  )

  const notesByVerse = useMemo(() => {
    const grouped = new Map<number, StudyVerseNote[]>()

    for (const note of chapterNotes) {
      const current = grouped.get(note.verseOrd) ?? []
      current.push(note)
      grouped.set(note.verseOrd, current)
    }

    return grouped
  }, [chapterNotes])

  const completedCount = workspaceState.completedChapterIds.length
  const totalCount = featuredBook.chapters.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const resetComposer = () => {
    setDraftVerseOrd(null)
    setEditingNoteId(null)
    setDraftBody('')
  }

  const selectChapter = (chapter: StudyChapter) => {
    setWorkspaceState((current) => ({
      ...current,
      lastChapterId: chapter.id,
    }))
    resetComposer()
    setReplyingToNoteId(null)
    setCommentDraft('')
  }

  const toggleChapterComplete = (chapterId: string) => {
    setWorkspaceState((current) => {
      const completed = current.completedChapterIds.includes(chapterId)
        ? current.completedChapterIds.filter((id) => id !== chapterId)
        : [...current.completedChapterIds, chapterId]

      return {
        ...current,
        completedChapterIds: completed,
      }
    })
  }

  const openNewNote = (verseOrd: number) => {
    setDraftVerseOrd(verseOrd)
    setEditingNoteId(null)
    setDraftBody('')
  }

  const startEdit = (note: StudyVerseNote) => {
    setDraftVerseOrd(note.verseOrd)
    setEditingNoteId(note.id)
    setDraftBody(note.body)
  }

  const handleSubmit = () => {
    const body = draftBody.trim()
    if (!body || draftVerseOrd == null) return

    const now = new Date().toISOString()

    setWorkspaceState((current) => ({
      ...current,
      notes: editingNoteId
        ? current.notes.map((note) =>
            note.id === editingNoteId ? { ...note, body, updatedAt: now } : note,
          )
        : [
            {
              id: crypto.randomUUID(),
              chapterId: activeChapter.id,
              verseOrd: draftVerseOrd,
              body,
              updatedAt: now,
              comments: [],
            },
            ...current.notes,
          ],
    }))

    resetComposer()
  }

  const deleteNote = (noteId: string) => {
    setWorkspaceState((current) => ({
      ...current,
      notes: current.notes.filter((note) => note.id !== noteId),
    }))

    setExpandedNoteIds((current) => current.filter((id) => id !== noteId))

    if (editingNoteId === noteId) {
      resetComposer()
    }

    if (replyingToNoteId === noteId) {
      setReplyingToNoteId(null)
      setCommentDraft('')
    }
  }

  const toggleComments = (noteId: string) => {
    setExpandedNoteIds((current) =>
      current.includes(noteId)
        ? current.filter((id) => id !== noteId)
        : [...current, noteId],
    )
  }

  const submitComment = (noteId: string) => {
    const body = commentDraft.trim()
    if (!body) return

    const now = new Date().toISOString()

    setWorkspaceState((current) => ({
      ...current,
      notes: current.notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              comments: [
                ...note.comments,
                {
                  id: crypto.randomUUID(),
                  body,
                  updatedAt: now,
                },
              ],
              updatedAt: now,
            }
          : note,
      ),
    }))

    setExpandedNoteIds((current) => (current.includes(noteId) ? current : [...current, noteId]))
    setReplyingToNoteId(null)
    setCommentDraft('')
  }

  return (
    <main className="study-shell">
      <section className="study-hero">
        <div className="study-hero__copy">
          <div className="study-hero__meta">
            <p className="study-eyebrow">
              Logged in as {user.displayName ?? user.email ?? 'Learner'}
            </p>
            <button type="button" className="theme-toggle" onClick={onToggleTheme}>
              {theme === 'dark' ? 'Day mode' : 'Night mode'}
            </button>
          </div>
          <h1>{featuredBook.title}</h1>
          <p className="study-hero__subtitle">{featuredBook.subtitle}</p>
          <p className="study-hero__description">{featuredBook.description}</p>
        </div>
        <div className="study-hero__card">
          <p className="study-card__label">Learning path</p>
          <strong>{featuredBook.duration}</strong>
          <div className="study-progress mt-3">
            <div className="study-progress__bar">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <p>
              {completedCount} / {totalCount} chapters completed
            </p>
          </div>
        </div>
      </section>

      <section className="study-layout">
        <aside className="study-sidebar">
          <div className="study-panel">
            <h2>学习成果</h2>
            <ul className="study-outcomes">
              {featuredBook.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="study-panel">
            <div className="study-panel__heading">
              <h2>章节</h2>
              <span>{totalCount} chapters</span>
            </div>
            <div className="chapter-list">
              {featuredBook.chapters.map((chapter) => {
                const selected = chapter.id === activeChapter.id
                const completed = workspaceState.completedChapterIds.includes(chapter.id)

                return (
                  <article
                    key={chapter.id}
                    className={`chapter-card${selected ? ' is-active' : ''}`}
                  >
                    <button
                      type="button"
                      className="chapter-card__select"
                      onClick={() => selectChapter(chapter)}
                    >
                      <p className="chapter-card__eyebrow">Chapter {chapter.number}</p>
                      <h3>{chapter.title}</h3>
                      <p>{chapter.focus}</p>
                    </button>
                    <button
                      type="button"
                      className={`chapter-status${completed ? ' is-complete' : ''}`}
                      onClick={() => {
                        toggleChapterComplete(chapter.id)
                      }}
                    >
                      {completed ? 'Completed' : 'Mark done'}
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        </aside>

        <section className="study-main">
          <div className="study-panel chapter-focus">
            <div className="study-panel__heading">
              <div>
                <p className="chapter-card__eyebrow">{activeChapter.passage}</p>
                <h2>{activeChapter.title}</h2>
              </div>
              <button
                type="button"
                className={`chapter-toggle${workspaceState.completedChapterIds.includes(activeChapter.id) ? ' is-complete' : ''}`}
                onClick={() => toggleChapterComplete(activeChapter.id)}
              >
                {workspaceState.completedChapterIds.includes(activeChapter.id)
                  ? '已完成'
                  : '标记本章已完成'}
              </button>
            </div>

            <div className="chapter-grid">
              <article>
                <h3>本章重点</h3>
                <p>{activeChapter.summary}</p>
              </article>
              <article>
                <h3>关键经文</h3>
                <blockquote>{activeChapter.keyVerse}</blockquote>
              </article>
            </div>

            <div>
              <h3>建议思考</h3>
              <ul className="prompt-list">
                {activeChapter.prompts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="study-panel scripture-panel study-layout__full">
          <div className="study-panel__heading">
            <div>
              <h2>Chapter study</h2>
              <span>{activeScripture ? activeChapter.passage : 'Scripture draft coming next'}</span>
            </div>
            {draftVerseOrd != null && (
              <button type="button" className="btn btn-link btn-sm" onClick={resetComposer}>
                Cancel
              </button>
            )}
          </div>

          {!activeScripture ? (
            <div className="empty-state">
              <h3>这章的经文还没接上</h3>
              <p>先保留骨架。下一步接 chapter json 后，这里就会显示逐节经文。</p>
            </div>
          ) : (
            <div className="verse-study">
              <div className="verse-study__header">
                <span>Verse</span>
                <span>Scripture</span>
                <span>Notes</span>
              </div>

              <div className="verse-study__rows">
                {activeScripture.verses.map((verse) => {
                  const verseNotes = notesByVerse.get(verse.verseOrd) ?? []
                  const isComposerOpen = draftVerseOrd === verse.verseOrd

                  return (
                    <article key={verse.verseOrd} className="verse-row">
                      <div className="verse-row__ord">{verse.verseOrd}</div>
                      <div className="verse-row__scripture">
                        <p>{verse.text}</p>
                        {secondaryScripture?.verses[verse.verseOrd - 1] && (
                          <p className="scripture-secondary">
                            {secondaryScripture.verses[verse.verseOrd - 1].text}
                          </p>
                        )}
                      </div>

                      <div className="verse-row__notes">
                        {verseNotes.length > 0 && (
                          <div className="verse-note-list">
                            {verseNotes.map((note) => {
                              const isExpanded = expandedNoteIds.includes(note.id)
                              const isReplying = replyingToNoteId === note.id

                              return (
                                <article key={note.id} className="verse-note-card">
                                  <div className="verse-note-card__header">
                                    <p>{new Date(note.updatedAt).toLocaleString()}</p>
                                    <div className="note-actions">
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => startEdit(note)}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => toggleComments(note.id)}
                                      >
                                        {isExpanded ? 'Hide comments' : 'Comments'}
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => deleteNote(note.id)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>

                                  <p className="note-card__body">{note.body}</p>

                                  {isExpanded && (
                                    <div className="comment-thread">
                                      <div className="comment-thread__list">
                                        {note.comments.map((comment) => (
                                          <article key={comment.id} className="comment-card">
                                            <p>{comment.body}</p>
                                            <span>
                                              {new Date(comment.updatedAt).toLocaleString()}
                                            </span>
                                          </article>
                                        ))}
                                      </div>

                                      {isReplying ? (
                                        <div className="note-editor note-editor--comment">
                                          <textarea
                                            className="form-control"
                                            rows={3}
                                            value={commentDraft}
                                            onChange={(event) => setCommentDraft(event.target.value)}
                                            placeholder="Add a follow-up comment..."
                                          />
                                          <div className="note-actions">
                                            <button
                                              type="button"
                                              className="btn btn-primary btn-sm"
                                              onClick={() => submitComment(note.id)}
                                              disabled={!commentDraft.trim()}
                                            >
                                              Post
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          className="btn btn-link btn-sm"
                                          onClick={() => {
                                            setReplyingToNoteId(note.id)
                                            setCommentDraft('')
                                            setExpandedNoteIds((current) =>
                                              current.includes(note.id)
                                                ? current
                                                : [...current, note.id],
                                            )
                                          }}
                                        >
                                          + Add comment
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </article>
                              )
                            })}
                          </div>
                        )}

                        <div className="verse-note-composer">
                          {!isComposerOpen ? (
                            <button
                              type="button"
                              className="verse-add"
                              onClick={() => openNewNote(verse.verseOrd)}
                            >
                              + Add note
                            </button>
                          ) : (
                            <div className="note-editor note-editor--inline note-editor--compact">
                              <textarea
                                className="form-control"
                                rows={3}
                                value={draftBody}
                                onChange={(event) => setDraftBody(event.target.value)}
                                placeholder="Write a note on this verse..."
                              />
                              <div className="verse-note-composer__actions">
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={handleSubmit}
                                  disabled={!draftBody.trim()}
                                >
                                  {editingNoteId ? 'Save' : 'Post'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
