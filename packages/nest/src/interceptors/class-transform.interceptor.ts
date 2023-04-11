import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Conversation, Message } from "gpt-turbo";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ClassTransformInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (data instanceof Object) {
                    this.handleClassInstances(data);
                }
                return data;
            })
        );
    }

    private handleClassInstances(obj: any): void {
        if (Array.isArray(obj)) {
            obj.forEach((item) => {
                if (item instanceof Object) {
                    this.handleClassInstances(item);
                }
            });
        } else if (obj instanceof Object) {
            for (const [key, value] of Object.entries(obj)) {
                if (value instanceof Object) {
                    this.handleClassInstances(value);
                }

                if (value instanceof Conversation) {
                    obj[key] = this.handleConversationInstance(value);
                } else if (value instanceof Message) {
                    obj[key] = this.handleMessageInstance(value);
                }
            }
        }
    }

    private handleConversationInstance(instance: Conversation): any {
        const { apiKey, ...config } = instance.getConfig();

        return {
            ...config,
            id: instance.id,
            messages: instance
                .getMessages()
                .map((message) => this.handleMessageInstance(message)),
            cost: instance.getCost(),
            cumulativeCost: instance.getCumulativeCost(),
            size: instance.getSize(),
            cumulativeSize: instance.getCumulativeSize(),
        };
    }

    private handleMessageInstance(instance: Message): any {
        const {
            content,
            role,
            cost,
            flags,
            id,
            isFlagged,
            isStreaming,
            model,
            size,
        } = instance;

        return {
            content,
            role,
            cost,
            flags,
            id,
            isFlagged,
            isStreaming,
            model,
            size,
        };
    }
}
