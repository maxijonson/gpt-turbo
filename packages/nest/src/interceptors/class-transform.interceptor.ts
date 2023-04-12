import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Conversation, Message } from "gpt-turbo";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import messageToJson from "../utils/messageToJson.js";

@Injectable()
export class ClassTransformInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (Array.isArray(data)) {
                    return data.map((item) => {
                        if (item instanceof Object) {
                            return this.handleClassInstances(item);
                        }
                        return item;
                    });
                } else if (data instanceof Object) {
                    return this.handleClassInstances(data);
                }
                return data;
            })
        );
    }

    private handleClassInstances(obj: any) {
        if (obj instanceof Conversation) {
            return this.handleConversationInstance(obj);
        } else if (obj instanceof Message) {
            return this.handleMessageInstance(obj);
        } else {
            for (const [key, value] of Object.entries(obj)) {
                if (value instanceof Object) {
                    obj[key] = this.handleClassInstances(value);
                }
            }
        }
        return obj;
    }

    private handleConversationInstance(instance: Conversation) {
        const { apiKey, ...config } = instance.getConfig();

        return {
            id: instance.id,
            config,
            messages: instance
                .getMessages()
                .map((message) => this.handleMessageInstance(message)),
            cost: instance.getCost(),
            cumulativeCost: instance.getCumulativeCost(),
            size: instance.getSize(),
            cumulativeSize: instance.getCumulativeSize(),
        };
    }

    private handleMessageInstance(instance: Message) {
        return messageToJson(instance);
    }
}
