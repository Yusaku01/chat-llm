import { mastra } from "@/mastra";
import { toAISdkFormat } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse, UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const agent = mastra.getAgent("weatherAgent");
  const result = await agent.stream(messages);

  return createUIMessageStreamResponse({
    stream: toAISdkFormat(result, { from: "agent" }),
  });
}
