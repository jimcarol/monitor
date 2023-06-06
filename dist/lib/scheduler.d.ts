interface scheduleRule {
    hour: number;
    minute: number;
    tz?: string;
}
declare class Scheduler {
    private jobs;
    init(rule?: scheduleRule): Promise<void>;
    del(key: string): void;
}
declare const _default: Scheduler;
export default _default;
