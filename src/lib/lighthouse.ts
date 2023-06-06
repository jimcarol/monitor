import fs from 'fs'
import lighthouse from 'lighthouse'
import DriverPool from './driverpool'

export const startTest = async ({
  driverpool,
  url,
  formFactor,
  ...otherprops
}:{
  driverpool: DriverPool,
  url: string,
  formFactor?: string,
}): Promise<any> => {
  const chromeDriver = await driverpool.pop()
  console.log("chromeDriver=====>", chromeDriver?.id)
  if (!chromeDriver) {
    console.log('driver pool not useful driver, need wait ==<>', url)
    // wait 10s
    await new Promise((r) => {
      setTimeout(r, 30000)
    })
    return await startTest({ driverpool, url, formFactor, ...otherprops })
  }

  const options = {
    logLevel: 'info',
    formFactor,
    output: 'html',
    onlyCategories: ['performance'],
    onlyAudits: ['performance','metrics'],
    port: chromeDriver.driver.port,
    throttling: {
      rttMs: 170,
      requestLatencyMs: 170,
      throughputKbps: 9 * 1024,
      downloadThroughputKbps: 9000,
      uploadThroughputKbps: 9000,
    },
    ...otherprops
  }
console.log(options,"---->")
  const runnerResult = await lighthouse(
    url,
    options as any,
  )

  const audits = [
    'performance',
    'first-contentful-paint',
    'interactive',
    'speed-index',
    'total-blocking-time',
    'largest-contentful-paint',
    'cumulative-layout-shift',
  ]
  const fcp = runnerResult?.lhr.audits['first-contentful-paint'] || 0
  const lcp = runnerResult?.lhr.audits['largest-contentful-paint'] || 0
  const cls = runnerResult?.lhr.audits['cumulative-layout-shift'] || 0

  const result:any = {}
  for (const audit of audits) {
    const { numericValue = 0, displayValue } = runnerResult?.lhr?.audits[audit] || {}
    let value = Number(numericValue)
    if (audit === 'performance') { 
      value = runnerResult?.lhr?.categories.performance.score as number * 100
    } else if(audit === 'cumulative-layout-shift') {
      value = Number(displayValue)
    } else {
      if (numericValue) {
        value = Number((numericValue / 1000).toFixed(2))
     }
    }

    result[audit] = value
  }

  console.log(
    `${url} =====>  fcp ${JSON.stringify(fcp)}, lcp ${JSON.stringify(
      lcp,
    )}, cls ${JSON.stringify(cls)}`,
  )

  driverpool.push(chromeDriver)
  return result
}
