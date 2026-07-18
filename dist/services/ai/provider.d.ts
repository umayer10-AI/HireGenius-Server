export interface AIMessage {
    role: "system" | "user" | "assistant";
    content: string;
}
export interface AIProvider {
    name: string;
    complete(messages: AIMessage[], options?: {
        temperature?: number;
    }): Promise<string>;
    stream(messages: AIMessage[], onChunk: (chunk: string) => void, options?: {
        temperature?: number;
    }): Promise<string>;
}
export declare function getAIProvider(): AIProvider;
export declare function safeAIComplete(messages: AIMessage[], options?: {
    temperature?: number;
}): Promise<string>;
//# sourceMappingURL=provider.d.ts.map