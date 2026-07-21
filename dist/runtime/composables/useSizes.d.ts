export function useSizes(): {
    reference: import("vue").Ref<undefined, undefined>;
    sizes: import("vue").Ref<{
        width: number;
        height: number;
        fr: number;
    }, {
        width: number;
        height: number;
        fr: number;
    }>;
    scroll: import("vue").Ref<{
        top: number;
        left: number;
        direction: number;
    }, {
        top: number;
        left: number;
        direction: number;
    }>;
    observe: (el: any, fn: any) => void;
    mw: (size: any) => number;
    mh: (size: any) => number;
    init: () => void;
};
