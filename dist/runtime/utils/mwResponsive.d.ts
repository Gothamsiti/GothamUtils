export type MwResponsiveRule = {
    breakpoint: number;
    className: string;
    css: string;
};
export declare const MW_RESPONSIVE_STATE_KEY = "gothamutils:mw-responsive-rules";
export declare function renderMwResponsiveRules(rules: MwResponsiveRule[]): string;
export declare function registerMwResponsiveRule(rule: MwResponsiveRule): void;
export declare function registerMwResponsiveRules(newRules: MwResponsiveRule[]): void;
export declare function initMwResponsive(): void;
