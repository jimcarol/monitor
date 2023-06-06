"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chromeLauncher = require('chrome-launcher');
const events_1 = __importDefault(require("events"));
const lanuchChrome = async () => {
    return await chromeLauncher.launch({
        chromeFlags: [
            '--headless',
            '--no-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
        ],
        logLevel: 'info',
    });
};
const limit = 1;
class DriverPool extends events_1.default {
    constructor() {
        super(...arguments);
        this.pools = [];
        this.locked = false;
    }
    static setup() {
        console.log('driver pool start setup ====> ');
        const poolInstance = new DriverPool();
        // for (let index = 0; index < limit; index++) {
        //   lanuchChrome().then((chromDriver) => {
        //     poolInstance.pools.push({
        //       id: Math.round(Math.random() * 1000000),
        //       driver: chromDriver,
        //       inUse: false,
        //     })
        //     console.log('a driver initial completed --->', poolInstance.pools)
        //     if (poolInstance.pools.length === limit) {
        //       console.log('total drivers initial completed')
        //       poolInstance.emit('initialed')
        //     }
        //   })
        // }
        poolInstance.emit('initialed');
        return poolInstance;
    }
    async pop() {
        if (!this.locked) {
            this.locked = true;
            const item = this.pools.find((item) => !item.inUse);
            if (!item) {
                if (this.pools.length > limit - 1) {
                    this.locked = false;
                    return null;
                }
                const chromDriver = await lanuchChrome();
                const driver = {
                    id: Math.round(Math.random() * 1000000),
                    driver: chromDriver,
                    inUse: true,
                };
                this.pools.push(driver);
                this.locked = false;
                return driver;
            }
            item.inUse = true;
            this.locked = false;
            return item;
        }
        return null;
    }
    push(driver) {
        const index = this.pools.findIndex((item) => item.id === driver.id);
        console.log(`index ====> ${driver.id} ===> ${index}`);
        if (index > -1) {
            // this.pools[index].inUse = false
            driver.driver.kill();
            this.pools.splice(index, 1);
        }
        else {
            driver.driver.kill();
        }
    }
    release() {
        this.pools.forEach((item) => item.driver.kill());
    }
}
exports.default = DriverPool;
