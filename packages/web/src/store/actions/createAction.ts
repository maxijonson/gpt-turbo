import { useAppStore } from "..";

export type AppStoreSet = typeof useAppStore.setState;
export type AppStoreGet = typeof useAppStore.getState;
export type AppStoreSubscribe = typeof useAppStore.subscribe;
export type AppStorePersist = typeof useAppStore.persist;

export interface AppStoreMethods {
    set: AppStoreSet;
    get: AppStoreGet;
    subscribe: AppStoreSubscribe;
    persist: AppStorePersist;
}

export type AppStoreAction = (
    storeMethods: AppStoreMethods,
    ...args: any[]
) => any;

export const createAction = <
    A extends AppStoreAction,
    P extends any[] = A extends (
        storeMethods: AppStoreMethods,
        ...args: infer U
    ) => any
        ? U
        : never,
    F = (...args: P) => ReturnType<A>
>(
    action: A,
    actionName: string | undefined | { type: unknown } = action.name ||
        undefined
): F => {
    const set: AppStoreSet = (nextStateOrUpdater, shouldReplace, action) => {
        return useAppStore.setState(
            nextStateOrUpdater,
            shouldReplace,
            action || actionName
        );
    };

    const storeMethods: AppStoreMethods = {
        set,
        get: useAppStore.getState,
        subscribe: useAppStore.subscribe,
        persist: useAppStore.persist,
    };
    return ((...args: P) => action(storeMethods, ...args)) as F;
};
