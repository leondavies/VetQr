"use client"

import { useState, useEffect } from "react"
import { supabase } from "../utils/supabase"
import type { VetVisit, Pet } from "../types/pet"
import VetUpdatePetForm from "./VetUpdatePetForm"

export default function VetVisitManager() {
  const [visits, setVisits] = useState<(VetVisit & { pet: Pet })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from("vetvisit")
        .select(`
          *,
          pet (
            *,
            owner (*),
            qrcode (*),
            veterinarian (*)
          )
        `)
        .order("visitdate", { ascending: false })

      if (error) throw error

      setVisits(data)
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const updateVisitStatus = async (visitId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("vetvisit").update({ status: newStatus }).eq("visitid", visitId)

      if (error) throw error

      setVisits(visits.map((visit) => (visit.visitid === visitId ? { ...visit, status: newStatus } : visit)))
    } catch (error) {
      setError((error as Error).message)
    }
  }

  const handleUpdatePet = (updatedPet: Pet) => {
    setVisits(visits.map((visit) => (visit.pet.petid === updatedPet.petid ? { ...visit, pet: updatedPet } : visit)))
    setEditingPet(null)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vet Visit Manager</h1>
      {editingPet ? (
        <VetUpdatePetForm pet={editingPet} onUpdate={handleUpdatePet} onCancel={() => setEditingPet(null)} />
      ) : (
        <div className="grid gap-6">
          {visits.map((visit) => (
            <div key={visit.visitid} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">
                {visit.pet.name} - {new Date(visit.visitdate).toLocaleDateString()}
              </h2>
              <p className="mb-2">Status: {visit.status}</p>
              <p className="mb-4">Notes: {visit.notes}</p>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => updateVisitStatus(visit.visitid, "in_progress")}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Start Visit
                </button>
                <button
                  onClick={() => updateVisitStatus(visit.visitid, "completed")}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Complete Visit
                </button>
                <button
                  onClick={() => updateVisitStatus(visit.visitid, "cancelled")}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel Visit
                </button>
              </div>
              <button
                onClick={() => setEditingPet(visit.pet)}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Edit Pet Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

