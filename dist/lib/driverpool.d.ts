/// <reference types="node" />
import EventEmitter from 'events';
interface Pool {
    id: number;
    driver: any;
    inUse: boolean;
}
declare class DriverPool extends EventEmitter {
    private pools;
    private locked;
    static setup(): DriverPool;
    pop(): Promise<Pool | null>;
    push(driver: Pool): void;
    release(): void;
}
export default DriverPool;
