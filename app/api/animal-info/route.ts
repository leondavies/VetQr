import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { species, breed } = await req.json()
    const prompt = `Provide a brief overview of the ${breed} ${species}. Include information about their typical temperament, lifespan, size, and any unique characteristics or care requirements. Keep the response concise and informative. Limit the response to 200 words.`

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      stream: true,
      max_tokens: 300,
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    if (error instanceof Error) {
      console.error("OpenAI API error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      console.error("An unexpected error occurred:", error)
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
    }
  }
}

