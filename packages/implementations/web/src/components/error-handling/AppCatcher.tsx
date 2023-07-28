import React, { ErrorInfo } from "react";
import AppErrorModal from "./AppErrorModal";

export interface AppCatcherProps {
    children?: React.ReactNode;
}

export interface AppCatcherState {
    error: Error | null;
}

class AppCatcher extends React.Component<AppCatcherProps, AppCatcherState> {
    constructor(props: AppCatcherProps) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        const { error } = this.state;
        const { children } = this.props;

        if (!error) {
            return children;
        }

        return <AppErrorModal error={error} />;
    }
}

export default AppCatcher;
