"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const node_fs_1 = require("node:fs");
const driverpool_1 = __importDefault(require("./driverpool"));
const lighthouse_1 = require("./lighthouse");
const fs_1 = require("fs");
const driverpool = driverpool_1.default.setup();
const audits = [
    'performance',
    'first-contentful-paint',
    'interactive',
    'speed-index',
    'total-blocking-time',
    'largest-contentful-paint',
    'cumulative-layout-shift',
];
class Job {
    constructor() {
        this.jobHandler = null;
    }
    start() {
        driverpool.on('initialed', () => {
            console.log('[Event initialed]: driverpool initial completed');
        });
    }
    end() {
        this.jobHandler && clearInterval(this.jobHandler);
    }
    async queueTest(options, results, date) {
        const data1 = await (0, lighthouse_1.startTest)(options);
        const data2 = await (0, lighthouse_1.startTest)(options);
        const data3 = await (0, lighthouse_1.startTest)(options);
        // const data1 = await test1
        // const data2 = await test2
        // const data3 = await test3
        audits.forEach((audit) => {
            let value = (data1[audit] + data2[audit] + data3[audit]) / 3;
            if (audit === 'performance') {
                value = Math.round(value);
            }
            else if (audit === 'cumulative-layout-shift') {
                value = Number(value.toFixed(3));
            }
            else {
                value = Number(value.toFixed(2));
            }
            if (!results[options.url])
                results[options.url] = {};
            if (!results[options.url][audit])
                results[options.url][audit] = {};
            if (!results[options.url][audit][options.formFactor])
                results[options.url][audit][options.formFactor] = {};
            results[options.url][audit][options.formFactor][date] = value;
        });
    }
    async startJob(env = 'qa') {
        const date = new Date().toISOString().split('T')[0];
        let filepath = path_1.default.join(process.cwd(), `assets/qa.json`);
        let resultFile = path_1.default.join(process.cwd(), `public/stg-result.json`);
        if (env === 'prod') {
            filepath = path_1.default.join(process.cwd(), `assets/prod.json`);
            resultFile = path_1.default.join(process.cwd(), `public/prod-result.json`);
        }
        const urls = (0, node_fs_1.readFileSync)(filepath, { encoding: 'utf-8' });
        const urlsObject = JSON.parse(urls);
        let results = {};
        if ((0, fs_1.existsSync)(resultFile)) {
            results = JSON.parse((0, node_fs_1.readFileSync)(resultFile, { encoding: 'utf-8' }));
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
                emulatedUserAgent: 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4590.2 Mobile Safari/537.36 Chrome-Lighthouse',
            };
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
                emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4590.2 Safari/537.36 Chrome-Lighthouse',
                throttling: {
                    rttMs: 40,
                    throughputKbps: 10 * 1024,
                    cpuSlowdownMultiplier: 1,
                    requestLatencyMs: 0,
                    downloadThroughputKbps: 0,
                    uploadThroughputKbps: 0,
                },
            };
            await this.queueTest(mobileOptions, results, date);
            await this.queueTest(desktopOptions, results, date);
        }
        (0, node_fs_1.writeFileSync)(resultFile, JSON.stringify(results));
    }
}
exports.default = new Job();
