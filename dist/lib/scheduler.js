"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
const job_1 = __importDefault(require("./job"));
const DEFAULT_RULE = {
    hour: 5,
    minute: 0,
    tz: 'Etc/UTC',
};
class Scheduler {
    constructor() {
        this.jobs = {};
    }
    async init(rule = DEFAULT_RULE) {
        console.log(`Job  successfully initialized`);
        this.jobs['lighthouse'] = node_schedule_1.default.scheduleJob(rule, async function () {
            console.log("start runing lighthouse!!!");
            await job_1.default.startJob('qa');
            await job_1.default.startJob('prod');
        });
        await job_1.default.startJob('qa');
        await job_1.default.startJob('prod');
    }
    del(key) {
        if (this.jobs[key]) {
            this.jobs[key].cancel();
            delete this.jobs[key];
        }
    }
}
exports.default = new Scheduler();
