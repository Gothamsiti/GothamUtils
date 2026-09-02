export type MwResponsiveRule = {
    breakpoint: number;
    className: string;
    css: string;
};
export declare function registerMwResponsiveRule(rule: MwResponsiveRule): void;
export declare function registerMwResponsiveRules(newRules: MwResponsiveRule[]): void;
export declare function initMwResponsive(): void;
