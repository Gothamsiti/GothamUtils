type ClassField = string | string[] | undefined;
type MaybeGetter = ClassField | (() => ClassField);
export declare function useMwClass(source: MaybeGetter): {
    classes: string[];
    style: Record<string, string>;
};
export {};
