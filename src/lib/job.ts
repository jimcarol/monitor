import path from 'path'
import { readFileSync, writeFileSync } from 'node:fs'
import DriverPool from './driverpool'
import { startTest } from './lighthouse'
import { existsSync } from 'fs'
const driverpool = DriverPool.setup()

const audits = [
  'performance',
  'first-contentful-paint',
  'interactive',
  'speed-index',
  'total-blocking-time',
  'largest-contentful-paint',
  'cumulative-layout-shift',
]

class Job {
  private jobHandler: string | number | NodeJS.Timer | null | undefined = null

  start() {
    driverpool.on('initialed', () => {
      console.log('[Event initialed]: driverpool initial completed')
    })
  }

  end() {
    this.jobHandler && clearInterval(this.jobHandler)
  }

  async queueTest(options: any, results: any, date: string) {
    const data1 = await startTest(options)
    const data2 = await startTest(options)
    const data3 = await startTest(options)
    // const data1 = await test1
    // const data2 = await test2
    // const data3 = await test3

    audits.forEach((audit) => {
      let value = (data1[audit] + data2[audit] + data3[audit]) / 3

      if (audit === 'performance') {
        value = Math.round(value)
      } else if (audit === 'cumulative-layout-shift') {
        value = Number(value.toFixed(3))
      } else {
        value = Number(value.toFixed(2))
      }

      if (!results[options.url]) results[options.url] = {}
      if (!results[options.url][audit]) results[options.url][audit] = {}
      if (!results[options.url][audit][options.formFactor])
        results[options.url][audit][options.formFactor] = {}
      results[options.url][audit][options.formFactor][date] = value
    })
  }

  async startJob(env: string = 'qa') {
    const date = new Date().toISOString().split('T')[0]
    let filepath = path.join(process.cwd(), `assets/qa.json`)
    let resultFile = path.join(process.cwd(), `public/stg-result.json`)

    if (env === 'prod') {
      filepath = path.join(process.cwd(), `assets/prod.json`)
      resultFile = path.join(process.cwd(), `public/prod-result.json`)
    }

    const urls = readFileSync(filepath, { encoding: 'utf-8' })
    const urlsObject = JSON.parse(urls)
    let results: any = {}

    if (existsSync(resultFile)) {
      results = JSON.parse(readFileSync(resultFile, { encoding: 'utf-8' }))
    }

    for (const url of urlsObject) {
      const mobileOptions = {
        driverpool,
        url,
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 360,
          height: 640,
          deviceScaleFactor: 2.625,
          disabled: false,
        },
        emulatedUserAgent:
          'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4590.2 Mobile Safari/537.36 Chrome-Lighthouse',
      }
      const desktopOptions = {
        driverpool,
        url,
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        emulatedUserAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4590.2 Safari/537.36 Chrome-Lighthouse',
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0, // 0 means unset
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      }
      await this.queueTest(mobileOptions, results, date)
      await this.queueTest(desktopOptions, results, date)
    }

    writeFileSync(resultFile, JSON.stringify(results))
  }
}

export default new Job()
