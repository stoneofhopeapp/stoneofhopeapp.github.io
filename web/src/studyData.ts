export type StudyChapter = {
  id: string
  number: number
  title: string
  passage: string
  focus: string
  summary: string
  keyVerse: string
  prompts: string[]
}

export type StudyBook = {
  id: string
  title: string
  subtitle: string
  description: string
  outcomes: string[]
  duration: string
  chapters: StudyChapter[]
}

export type ScriptureVerse = {
  verseOrd: number
  text: string
}

export type ScriptureChapter = {
  versionAbbr: string
  bookOrd: number
  bookName: string
  chapterOrd: number
  verses: ScriptureVerse[]
}

/** Mock scripture lives on this book/chapter until more content is added. */
export const STUDY_CONNECTED_BOOK_ORD = 60

/** All study chapter links resolve here until more scripture is added. */
export const STUDY_PLACEHOLDER_CHAPTER_ORD = 1
export const STUDY_PLACEHOLDER_CHAPTER_ID = '1pet-1'

export const CANONICAL_STUDY_ROUTE = {
  bookOrd: STUDY_CONNECTED_BOOK_ORD,
  chapterOrd: STUDY_PLACEHOLDER_CHAPTER_ORD,
} as const

export function isStudyConnectedBook(bookOrd: number): boolean {
  return bookOrd === STUDY_CONNECTED_BOOK_ORD
}

export function normalizeStudyBookOrd(_bookOrd: number): number {
  return STUDY_CONNECTED_BOOK_ORD
}

export function normalizeStudyChapterOrd(_bookOrd: number, _chapterOrd: number): number {
  return STUDY_PLACEHOLDER_CHAPTER_ORD
}

export const firstPeterChapter1DraftNkJV: ScriptureChapter = {
  versionAbbr: 'NKJV',
  bookOrd: 60,
  bookName: '1 Peter',
  chapterOrd: 1,
  verses: [
    {
      verseOrd: 1,
      text: 'Peter, an apostle of Jesus Christ, To the pilgrims of the Dispersion in Pontus, Galatia, Cappadocia, Asia, and Bithynia,',
    },
    {
      verseOrd: 2,
      text: 'elect according to the foreknowledge of God the Father, in sanctification of the Spirit, for obedience and sprinkling of the blood of Jesus Christ: Grace to you and peace be multiplied.',
    },
    {
      verseOrd: 3,
      text: 'Blessed be the God and Father of our Lord Jesus Christ, who according to His abundant mercy has begotten us again to a living hope through the resurrection of Jesus Christ from the dead,',
    },
    {
      verseOrd: 4,
      text: 'to an inheritance incorruptible and undefiled and that does not fade away, reserved in heaven for you,',
    },
    {
      verseOrd: 5,
      text: 'who are kept by the power of God through faith for salvation ready to be revealed in the last time.',
    },
    {
      verseOrd: 6,
      text: 'In this you greatly rejoice, though now for a little while, if need be, you have been grieved by various trials,',
    },
    {
      verseOrd: 7,
      text: 'that the genuineness of your faith, being much more precious than gold that perishes, though it is tested by fire, may be found to praise, honor, and glory at the revelation of Jesus Christ,',
    },
    {
      verseOrd: 8,
      text: 'whom having not seen you love. Though now you do not see Him, yet believing, you rejoice with joy inexpressible and full of glory,',
    },
    {
      verseOrd: 9,
      text: 'receiving the end of your faith, the salvation of your souls.',
    },
    {
      verseOrd: 10,
      text: 'Of this salvation the prophets have inquired and searched carefully, who prophesied of the grace that would come to you,',
    },
    {
      verseOrd: 11,
      text: 'searching what, or what manner of time, the Spirit of Christ who was in them was indicating when He testified beforehand the sufferings of Christ and the glories that would follow.',
    },
    {
      verseOrd: 12,
      text: 'To them it was revealed that, not to themselves, but to us they were ministering the things which now have been reported to you through those who have preached the gospel to you by the Holy Spirit sent from heaven, things which angels desire to look into.',
    },
    {
      verseOrd: 13,
      text: 'Therefore gird up the loins of your mind, be sober, and rest your hope fully upon the grace that is to be brought to you at the revelation of Jesus Christ;',
    },
    {
      verseOrd: 14,
      text: 'as obedient children, not conforming yourselves to the former lusts, as in your ignorance;',
    },
    {
      verseOrd: 15,
      text: 'but as He who called you is holy, you also be holy in all your conduct,',
    },
    {
      verseOrd: 16,
      text: 'because it is written, "Be holy, for I am holy."',
    },
    {
      verseOrd: 17,
      text: 'And if you call on the Father, who without partiality judges according to each one’s work, conduct yourselves throughout the time of your stay here in fear;',
    },
    {
      verseOrd: 18,
      text: 'knowing that you were not redeemed with corruptible things, like silver or gold, from your aimless conduct received by tradition from your fathers,',
    },
    {
      verseOrd: 19,
      text: 'but with the precious blood of Christ, as of a lamb without blemish and without spot.',
    },
    {
      verseOrd: 20,
      text: 'He indeed was foreordained before the foundation of the world, but was manifest in these last times for you',
    },
    {
      verseOrd: 21,
      text: 'who through Him believe in God, who raised Him from the dead and gave Him glory, so that your faith and hope are in God.',
    },
    {
      verseOrd: 22,
      text: 'Since you have purified your souls in obeying the truth through the Spirit in sincere love of the brethren, love one another fervently with a pure heart,',
    },
    {
      verseOrd: 23,
      text: 'having been born again, not of corruptible seed but incorruptible, through the word of God which lives and abides forever,',
    },
    {
      verseOrd: 24,
      text: 'because "All flesh is as grass, And all the glory of man as the flower of the grass. The grass withers, And its flower falls away,"',
    },
    {
      verseOrd: 25,
      text: 'But the word of the Lord endures forever. Now this is the word which by the gospel was preached to you.',
    },
  ],
}

export const firstPeterChapter1DraftCuv: ScriptureChapter = {
  versionAbbr: 'CUV',
  bookOrd: 60,
  bookName: '彼得前书',
  chapterOrd: 1,
  verses: [
    {
      verseOrd: 1,
      text: '耶稣基督的使徒彼得写信给那分散在本都、加拉太、加帕多家、亚西亚、庇推尼寄居的，',
    },
    {
      verseOrd: 2,
      text: '就是照父神的先见被拣选，借着圣灵得成圣洁，以致顺服耶稣基督，又蒙他血所洒的人。愿恩惠、平安多多地加给你们。',
    },
    {
      verseOrd: 3,
      text: '愿颂赞归与我们主耶稣基督的父神。他曾照自己的大怜悯，借耶稣基督从死里复活，重生了我们，叫我们有活泼的盼望，',
    },
    {
      verseOrd: 4,
      text: '可以得着不能朽坏、不能玷污、不能衰残、为你们存留在天上的基业。',
    },
    {
      verseOrd: 5,
      text: '你们这因信蒙神能力保守的人，必能得着所预备、到末世要显现的救恩。',
    },
    {
      verseOrd: 6,
      text: '因此，你们是大有喜乐；但如今，在百般的试炼中暂时忧愁，',
    },
    {
      verseOrd: 7,
      text: '叫你们的信心既被试验，就比那被火试验仍然能坏的金子更显宝贵，可以在耶稣基督显现的时候得着称赞、荣耀、尊贵。',
    },
    {
      verseOrd: 8,
      text: '你们虽然没有见过他，却是爱他；如今虽不得看见，却因信他就有说不出来、满有荣光的大喜乐；',
    },
    {
      verseOrd: 9,
      text: '并且得着你们信心的果效，就是灵魂的救恩。',
    },
    {
      verseOrd: 10,
      text: '论到这救恩，那预先说你们要得恩典的众先知早已详细地寻求考察，',
    },
    {
      verseOrd: 11,
      text: '就是考察在他们心里基督的灵，预先证明基督受苦难，后来得荣耀，是指着什么时候，并怎样的时候。',
    },
    {
      verseOrd: 12,
      text: '他们得了启示，知道他们所传讲的一切事，不是为自己，乃是为你们。那靠着从天上差来的圣灵传福音给你们的人，现在将这些事报给你们；天使也愿意详细察看这些事。',
    },
    {
      verseOrd: 13,
      text: '所以要约束你们的心，谨慎自守，专心盼望耶稣基督显现的时候所带来给你们的恩。',
    },
    {
      verseOrd: 14,
      text: '你们既作顺命的儿女，就不要效法从前蒙昧无知的时候那放纵私欲的样子。',
    },
    {
      verseOrd: 15,
      text: '那召你们的既是圣洁，你们在一切所行的事上也要圣洁。',
    },
    {
      verseOrd: 16,
      text: '因为经上记着说：「你们要圣洁，因为我是圣洁的。」',
    },
    {
      verseOrd: 17,
      text: '你们既称那不偏待人、按各人行为审判人的主为父，就当存敬畏的心度你们在世寄居的日子，',
    },
    {
      verseOrd: 18,
      text: '知道你们得赎，脱去你们祖宗所传流虚妄的行为，不是凭着能坏的金银等物，',
    },
    {
      verseOrd: 19,
      text: '乃是凭着基督的宝血，如同无瑕疵、无玷污的羔羊之血。',
    },
    {
      verseOrd: 20,
      text: '基督在创世以前是预先被神知道的，却在这末世才为你们显现。',
    },
    {
      verseOrd: 21,
      text: '你们也因着他，信那叫他从死里复活、又给他荣耀的神，叫你们的信心和盼望都在于神。',
    },
    {
      verseOrd: 22,
      text: '你们既因顺从真理，洁净了自己的心，以致爱弟兄没有虚假，就当从心里彼此切实相爱。',
    },
    {
      verseOrd: 23,
      text: '你们蒙了重生，不是由于能坏的种子，乃是由于不能坏的种子，是借着神活泼常存的道。',
    },
    {
      verseOrd: 24,
      text: '因为凡有血气的，尽都如草；他的美荣都像草上的花。草必枯干，花必凋谢；',
    },
    {
      verseOrd: 25,
      text: '惟有主的道是永存的。所传给你们的福音就是这道。',
    },
  ],
}

export const featuredBookScriptureByChapterId: Record<
  string,
  { primary: ScriptureChapter; secondary?: ScriptureChapter }
> = {
  '1pet-1': {
    primary: firstPeterChapter1DraftNkJV,
  },
}

export function getScriptureForBookChapter(
  bookOrd: number,
  chapterOrd: number,
): { primary: ScriptureChapter; secondary?: ScriptureChapter } | null {
  if (bookOrd === STUDY_CONNECTED_BOOK_ORD && chapterOrd === STUDY_PLACEHOLDER_CHAPTER_ORD) {
    return featuredBookScriptureByChapterId[STUDY_PLACEHOLDER_CHAPTER_ID] ?? null
  }
  return null
}

export const featuredBook: StudyBook = {
  id: '1-peter',
  title: '彼得前书',
  subtitle: 'A five-chapter journey in hope, holiness, and steady faith',
  description:
    '用五章慢慢进入“活泼的盼望”。这个最小版本先聚焦《彼得前书》，让用户能按章节学习、记录受触动的经文、祷告与当下行动。',
  duration: '5 chapters · 1 focused study path',
  outcomes: [
    '每章先看主题，再进入自己的学习笔记',
    '记录观察、问题、祷告和本周行动',
    '保存最近学习进度，方便下次继续',
  ],
  chapters: [
    {
      id: '1pet-1',
      number: 1,
      title: '活泼的盼望与圣洁的呼召',
      passage: '1 Peter 1',
      focus: '重生的盼望、试炼中的信心、圣洁生活',
      summary:
        '第一章先把眼光从环境抬到神已经赐下的盼望。彼得提醒受苦中的信徒，信心会经过火炼，但神正在保守他们，也呼召他们在日常生活里活出圣洁。',
      keyVerse:
        '“那召你们的既是圣洁，你们在一切所行的事上也要圣洁。”',
      prompts: [
        '这一章最安慰你的“盼望”是什么？',
        '最近哪一个试炼最需要被重新放进神的视角里？',
        '“在一切所行的事上圣洁”对你今天最实际的挑战是什么？',
      ],
    },
    {
      id: '1pet-2',
      number: 2,
      title: '活石、祭司与见证',
      passage: '1 Peter 2',
      focus: '属灵身份、群体建造、美好品行',
      summary:
        '第二章把信徒的身份讲得非常清楚: 我们是活石、是君尊的祭司、是属神的子民。彼得不是只给身份感，而是要这身份转化成在人群中的见证。',
      keyVerse:
        '“惟有你们是被拣选的族类，是有君尊的祭司。”',
      prompts: [
        '这一章最触动你的身份图像是哪一个？',
        '神要你从哪些旧习惯或旧反应里出来？',
        '你在人群中的品行，正在讲述一个怎样的福音故事？',
      ],
    },
    {
      id: '1pet-3',
      number: 3,
      title: '温柔敬畏地回答人',
      passage: '1 Peter 3',
      focus: '关系中的美德、受苦中的见证、心中的盼望',
      summary:
        '第三章把焦点放在关系中的品格，也把受苦和见证放在一起。彼得提醒我们，真正有盼望的人，不只是能忍耐，也能用温柔敬畏的态度回答别人。',
      keyVerse:
        '“只要心里尊主基督为圣。有人问你们心中盼望的缘由，就要常作准备。”',
      prompts: [
        '最近谁在观察你如何面对压力或误解？',
        '你是否已经准备好解释自己里面的盼望？',
        '在一段关系里，你最需要操练的温柔或敬畏是什么？',
      ],
    },
    {
      id: '1pet-4',
      number: 4,
      title: '在末后的日子里彼此服事',
      passage: '1 Peter 4',
      focus: '为神而活、彼此相爱、恩赐服事、与基督一同受苦',
      summary:
        '第四章把“受苦”与“服事”放在同一张图里。彼得鼓励信徒不要再照人的情欲活着，而是用祷告、爱心和恩赐，在群体中彼此供应。',
      keyVerse:
        '“各人要照所得的恩赐彼此服事，作神百般恩赐的好管家。”',
      prompts: [
        '最近你最容易回到“为自己活”的哪个旧模式？',
        '神给你的哪一种恩赐可以更主动地拿出来服事人？',
        '彼此切实相爱，对你当前的群体关系意味着什么？',
      ],
    },
    {
      id: '1pet-5',
      number: 5,
      title: '谦卑、警醒、把忧虑卸给神',
      passage: '1 Peter 5',
      focus: '牧养、顺服、谦卑、争战与坚固',
      summary:
        '最后一章像一封温柔而坚定的结语。彼得一边劝勉领袖和年轻人，一边提醒所有人要谦卑、警醒，把忧虑真正卸给神，在属灵争战里站稳。',
      keyVerse:
        '“你们要将一切的忧虑卸给神，因为他顾念你们。”',
      prompts: [
        '你最近最重的一项忧虑是什么？',
        '“警醒”在你当前的属灵状态里具体是什么样子？',
        '神今天在邀请你用哪一种谦卑来重新站稳？',
      ],
    },
  ],
}
