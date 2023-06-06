/// <reference types="lighthouse/types/global-lh" />

declare module 'lighthouse' {
    function lighthouse(
      url: string,
      options: Partial<LH.CliFlags>,
    ): Promise<LH.RunnerResult>;
    Flags: any
    export = lighthouse;
  }