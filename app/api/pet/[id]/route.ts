import { NextResponse } from "next/server"
import { supabase } from "../../../../utils/supabase"
import type { Pet } from "../../../../types/pet"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const { data, error } = await supabase
    .from("Pet")
    .select(`
      *,
      Owner (*),
      QRCode (*),
      VetVisit (
        *,
        Veterinarian (*),
        MedicalHistory (*)
      )
    `)
    .eq("PetID", id)
    .single()

  if (error) {
    return new NextResponse(error.message, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const updatedPet: Partial<Pet> = await request.json()

  const { data, error } = await supabase.from("Pet").update(updatedPet).eq("PetID", id).select().single()

  if (error) {
    return new NextResponse(error.message, { status: 400 })
  }

  return NextResponse.json(data)
}

