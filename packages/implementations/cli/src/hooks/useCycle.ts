import React from "react";

// useCycle is a hook that cycles through an array of items. You can cycle to, next or previous. next and previous also accept a number to cycle by.
export default <T>(items: readonly T[], initialIndex = 0) => {
    const [index, setIndex] = React.useState(initialIndex);
    const item = items[index];

    const cycleTo = React.useCallback(
        (index: number) => {
            const boundedIndex = Math.min(Math.max(index, 0), items.length - 1);
            setIndex(boundedIndex);
        },
        [items.length]
    );

    const cycleBy = React.useCallback(
        (by: number) => {
            setIndex((currentIndex) => {
                if (by >= 0) {
                    return (currentIndex + by) % items.length;
                }
                return (
                    (currentIndex + by + items.length * Math.abs(by)) %
                    items.length
                );
            });
        },
        [items.length]
    );

    const cycleNext = React.useCallback(
        (by = 1) => {
            cycleBy(by);
        },
        [cycleBy]
    );

    const cyclePrevious = React.useCallback(
        (by = 1) => {
            cycleBy(-by);
        },
        [cycleBy]
    );

    return {
        item,
        index,
        cycleTo,
        cycleBy,
        cycleNext,
        cyclePrevious,
    };
};
