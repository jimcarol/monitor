"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTest = void 0;
const lighthouse_1 = __importDefault(require("lighthouse"));
const startTest = async ({ driverpool, url, formFactor, ...otherprops }) => {
    var _a, _b;
    const chromeDriver = await driverpool.pop();
    console.log("chromeDriver=====>", chromeDriver === null || chromeDriver === void 0 ? void 0 : chromeDriver.id);
    if (!chromeDriver) {
        console.log('driver pool not useful driver, need wait ==<>', url);
        // wait 10s
        await new Promise((r) => {
            setTimeout(r, 30000);
        });
        return await (0, exports.startTest)({ driverpool, url, formFactor, ...otherprops });
    }
    const options = {
        logLevel: 'info',
        formFactor,
        output: 'html',
        onlyCategories: ['performance'],
        onlyAudits: ['performance', 'metrics'],
        port: chromeDriver.driver.port,
        throttling: {
            rttMs: 170,
            requestLatencyMs: 170,
            throughputKbps: 9 * 1024,
            downloadThroughputKbps: 9000,
            uploadThroughputKbps: 9000,
        },
        ...otherprops
    };
    console.log(options, "---->");
    const runnerResult = await (0, lighthouse_1.default)(url, options);
    const audits = [
        'performance',
        'first-contentful-paint',
        'interactive',
        'speed-index',
        'total-blocking-time',
        'largest-contentful-paint',
        'cumulative-layout-shift',
    ];
    const fcp = (runnerResult === null || runnerResult === void 0 ? void 0 : runnerResult.lhr.audits['first-contentful-paint']) || 0;
    const lcp = (runnerResult === null || runnerResult === void 0 ? void 0 : runnerResult.lhr.audits['largest-contentful-paint']) || 0;
    const cls = (runnerResult === null || runnerResult === void 0 ? void 0 : runnerResult.lhr.audits['cumulative-layout-shift']) || 0;
    const result = {};
    for (const audit of audits) {
        const { numericValue = 0, displayValue } = ((_a = runnerResult === null || runnerResult === void 0 ? void 0 : runnerResult.lhr) === null || _a === void 0 ? void 0 : _a.audits[audit]) || {};
        let value = Number(numericValue);
        if (audit === 'performance') {
            value = ((_b = runnerResult === null || runnerResult === void 0 ? void 0 : runnerResult.lhr) === null || _b === void 0 ? void 0 : _b.categories.performance.score) * 100;
        }
        else if (audit === 'cumulative-layout-shift') {
            value = Number(displayValue);
        }
        else {
            if (numericValue) {
                value = Number((numericValue / 1000).toFixed(2));
            }
        }
        result[audit] = value;
    }
    console.log(`${url} =====>  fcp ${JSON.stringify(fcp)}, lcp ${JSON.stringify(lcp)}, cls ${JSON.stringify(cls)}`);
    driverpool.push(chromeDriver);
    return result;
};
exports.startTest = startTest;
