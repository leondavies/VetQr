import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    console.log("Attempting to upload file:", filePath)

    const { data, error } = await supabase.storage.from("pet-images").upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      console.error("Supabase storage upload error:", error)
      return NextResponse.json({ error: "Failed to upload image to storage: " + error.message }, { status: 500 })
    }

    if (!data) {
      console.error("No data returned from Supabase upload")
      return NextResponse.json({ error: "Failed to upload image to storage: No data returned" }, { status: 500 })
    }

    console.log("File uploaded successfully:", data)

    const {
      data: { publicUrl },
    } = supabase.storage.from("pet-images").getPublicUrl(filePath)

    console.log("Public URL:", publicUrl)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Unexpected error in upload-image route:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}

