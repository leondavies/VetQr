"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/utils/supabase"
import PetProfile from "@/components/PetProfile"
import type { Pet } from "@/types/pet"

export default function PetPage() {
  const { id } = useParams()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const { data, error } = await supabase
          .from("pet")
          .select(`
            *,
            owner (*),
            qrcode (*),
            veterinarian:vetid (*),
            vetvisit (
              *,
              veterinarian (*),
              medicalhistory (*)
            )
          `)
          .eq("shortid", id)
          .single()

        if (error) throw error

        setPet(data)
      } catch (error) {
        console.error("Error fetching pet:", error)
        setError("Failed to fetch pet information")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPet()
    }
  }, [id])

  if (loading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>
  if (!pet) return <div className="text-center mt-8">Pet not found</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Pet Profile</h1>
      <PetProfile pet={pet} />
    </div>
  )
}

