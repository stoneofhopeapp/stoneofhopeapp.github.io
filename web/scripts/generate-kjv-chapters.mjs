import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const sourcePath =
  process.env.KJV_SOURCE_PATH ??
  path.resolve(
    projectRoot,
    '../../KnowGrowShow/KnowGrowShow/Utils/DataFiles/KJV.json',
  )

const outputRoot = path.resolve(projectRoot, 'public/bible/KJV')

function normalizeVerse(rawVerse) {
  return {
    verseOrd: Number(rawVerse.verse),
    text: String(rawVerse.text ?? '').trim(),
  }
}

function buildChapterPayload(book, chapter) {
  const bookOrd = Number(book.nr)
  const chapterOrd = Number(chapter.chapter)
  const verses = Array.isArray(chapter.verses) ? chapter.verses.map(normalizeVerse) : []

  return {
    versionAbbr: 'KJV',
    bookOrd,
    bookName: String(book.name ?? ''),
    chapterOrd,
    verseCount: verses.length,
    verses,
  }
}

async function main() {
  const sourceJson = JSON.parse(await readFile(sourcePath, 'utf8'))
  const books = Array.isArray(sourceJson.books) ? sourceJson.books : []

  await rm(outputRoot, { recursive: true, force: true })
  await mkdir(outputRoot, { recursive: true })

  const manifest = {
    versionAbbr: 'KJV',
    sourcePath,
    generatedAt: new Date().toISOString(),
    bookCount: books.length,
    totalChapters: 0,
  }

  for (const book of books) {
    const bookOrd = Number(book.nr)
    const chapters = Array.isArray(book.chapters) ? book.chapters : []
    const bookDir = path.join(outputRoot, String(bookOrd))

    await mkdir(bookDir, { recursive: true })
    manifest.totalChapters += chapters.length

    for (const chapter of chapters) {
      const chapterPayload = buildChapterPayload(book, chapter)
      const chapterPath = path.join(bookDir, `${chapterPayload.chapterOrd}.json`)
      await writeFile(chapterPath, `${JSON.stringify(chapterPayload, null, 2)}\n`, 'utf8')
    }
  }

  await writeFile(
    path.join(outputRoot, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  )

  console.log(
    `Generated ${manifest.totalChapters} KJV chapter files in ${outputRoot}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
