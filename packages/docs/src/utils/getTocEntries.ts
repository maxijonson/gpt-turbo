import { MDX_ROOT_ID } from "@config/constants";

export interface TOCEntry {
    title: string;
    hash: string;
    level: number;
    element: HTMLHeadingElement;
}

const getTocEntries = () => {
    const root = document.getElementById(MDX_ROOT_ID);
    if (!root) return [];
    const els = Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6"));

    return els.reduce((entries, el) => {
        const title = el.textContent;
        const hash = el.getAttribute("data-hash");
        const level = parseInt(el.tagName.slice(1), 10);

        if (!title || !hash || isNaN(level)) return entries;

        return entries.concat({
            title,
            hash,
            level,
            element: el as HTMLHeadingElement,
        });
    }, [] as TOCEntry[]);
};

export default getTocEntries;
