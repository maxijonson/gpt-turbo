export class EventManager<
    T extends (...args: any[]) => void = (...args: any) => void
> {
    private listeners: Array<T> = [];

    public addListener(listener: T) {
        this.listeners.push(listener);
        return () => this.removeListener(listener);
    }

    public once(listener: T) {
        const onceListener = ((...args: Parameters<T>) => {
            listener(...args);
            this.removeListener(onceListener);
        }) as T;
        this.addListener(onceListener);
        return () => this.removeListener(onceListener);
    }

    public removeListener(listener: T) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    public emit(...args: Parameters<T>) {
        this.listeners.forEach((l) => l(...args));
    }

    public clear() {
        this.listeners = [];
    }
}
