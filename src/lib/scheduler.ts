import schedule from 'node-schedule'
import job from './job'

interface scheduleRule {
  hour: number
  minute: number
  tz?: string
}

const DEFAULT_RULE = {
  hour: 5,
  minute: 0,
  tz: 'Etc/UTC',
}

class Scheduler {
  private jobs: any = {}

  async init(rule: scheduleRule = DEFAULT_RULE) {
    console.log(`Job  successfully initialized`)
    
    this.jobs['lighthouse'] = schedule.scheduleJob(rule, async function () {
      console.log("start runing lighthouse!!!")
      await job.startJob('qa')
      await job.startJob('prod')
    })

    await job.startJob('qa')
    await job.startJob('prod')
  }

  del(key: string) {
    if (this.jobs[key]) {
      this.jobs[key].cancel()
      delete this.jobs[key]
    }
  }
}

export default new Scheduler()
