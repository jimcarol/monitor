import DriverPool from './driverpool';
export declare const startTest: ({ driverpool, url, formFactor, ...otherprops }: {
    driverpool: DriverPool;
    url: string;
    formFactor?: string | undefined;
}) => Promise<any>;
