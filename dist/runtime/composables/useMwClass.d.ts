type ClassField = string | string[] | undefined;
type MaybeGetter = ClassField | (() => ClassField);
/**
 * Con un getter il risultato è reattivo: nell'editor Storyblok le classi seguono le modifiche al blok.
 * `mw.classes` e `mw.style` restano leggibili come prima (reactive apre i computed).
 * Il primo parse avviene nel setup, così in SSR le regole responsive finiscono nel payload come sempre;
 * i ricalcoli successivi avvengono solo sul client.
 */
export declare function useMwClass(source: MaybeGetter): {
    classes: string[];
    style: Record<string, string>;
};
export {};
