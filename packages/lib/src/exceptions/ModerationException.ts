import {
    CreateModerationResponseResultsInnerCategories,
    CreateModerationResponseResultsInnerCategoryScores,
} from "openai";

export class ModerationException extends Error {
    public flaggedCategories: string[];

    constructor(
        public categories: CreateModerationResponseResultsInnerCategories,
        public categoryScores: CreateModerationResponseResultsInnerCategoryScores
    ) {
        super("This message was flagged by OpenAI's Moderation API."); // Temporary, to satisfy the Error constructor
        this.name = ModerationException.name;
        this.flaggedCategories = Object.keys(categories).filter(
            (category) => categories[category as keyof typeof categories]
        );
        this.message = `The following categories were flagged for violating OpenAI's usage policies: ${this.flaggedCategories.join(
            ", "
        )}`;
    }
}
