import { ZodError } from "zod";

const getErrorInfo = (error: unknown): { title: string; message: string } => {
    if (error instanceof ZodError) {
        return {
            title: "Validation Error",
            message: error.issues.map((issue) => issue.message).join(" "),
        };
    }

    if (error instanceof Error) {
        return { title: error.name, message: error.message };
    }

    return {
        title: "Unknown Error",
        message: "An unknown error occurred.",
    };
};

export default getErrorInfo;
