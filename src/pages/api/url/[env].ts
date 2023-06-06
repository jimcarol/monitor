import { NextApiRequest, NextApiResponse } from 'next'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'path'

const Regex = {
  qa: /^https:\/\/qa-www\.thebump\.com/,
  prod: /^https:\/\/www\.thebump\.com/,
}

type envType = 'qa' | 'prod'

const isVaildParameters = (env: envType, url: string | string[]) => {
  const vaildUrlRegex = Regex[env]
  if (Array.isArray(url)) {
    for (const item of url) {
      if (!vaildUrlRegex.test(item)) {
        return false
      }
    }
  } else {
    return vaildUrlRegex.test(url)
  }

  return true
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { env } = req.query
  const filepath = path.join(process.cwd(), `assets/${env}.json`)
  const urls = readFileSync(filepath, { encoding: 'utf-8' })
  const urlsObject: Array<string> = JSON.parse(urls)
  let result = urlsObject

  try {
    console.log('--->')
    if (req.method === 'POST') {
      const { url = '', urls = [''] } = req.body
      if (url) {
        if (isVaildParameters(env as envType, url)) {
          result = Array.from(new Set([...urlsObject, url]))
        } else {
          res
            .status(500)
            .json({
              error: `invaild Parameters, faild to match ${
                Regex[env as envType]
              }`,
            })
        }
      }

      if (urls) {
        if (isVaildParameters(env as envType, urls)) {
            let newUrls = urls
            if (!Array.isArray(urls)) {
                newUrls = Array(urls)
            }
          result = Array.from(new Set([...urlsObject, ...newUrls]))
        } else {
          res
            .status(500)
            .json({
              error: `invaild Parameters, faild to match ${
                Regex[env as envType]
              }`,
            })
        }
      }

      writeFileSync(filepath, JSON.stringify(result))
    }
  } catch (error) {
    console.log(error)
  }

  res.json({ data: result })
}
