declare class Job {
    private jobHandler;
    start(): void;
    end(): void;
    queueTest(options: any, results: any, date: string): Promise<void>;
    startJob(env?: string): Promise<void>;
}
declare const _default: Job;
export default _default;
