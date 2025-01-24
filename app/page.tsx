"use client"

import { useState, useEffect } from "react"
import type { Pet } from "../types/pet"
import PetProfile from "../components/PetProfile"
// import UpdatePetForm from "../components/UpdatePetForm"
import AddPetForm from "../components/AddPetForm"
import { supabase } from "../utils/supabase"
import { Search, Plus } from "lucide-react"

interface PetInfo {
  petid: string
  shortid: string
  name: string
}

export default function Home() {
  const [pets, setPets] = useState<PetInfo[]>([])
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      console.log("Fetching pets...")
      const { data, error } = await supabase.from("pet").select("petid, shortid, name").order("name")

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      console.log("Fetched pets:", data)

      // Filter out pets without shortid and generate temporary ones
      const petsWithShortId = data.map((pet) => ({
        ...pet,
        shortid: pet.shortid || pet.petid.substring(0, 6),
      }))

      setPets(petsWithShortId)
    } catch (error) {
      console.error("Error fetching pets:", error)
      setError("Failed to fetch pets: " + (error as Error).message)
    }
  }

  const handleFetchPet = async (id: string) => {
    try {
      console.log("Fetching pet with ID:", id)
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

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      if (!data) {
        console.error("No pet found with ID:", id)
        throw new Error("Pet not found")
      }

      console.log("Fetched pet data:", data)
      setSelectedPet(data)
    } catch (error) {
      console.error("Error fetching pet data:", error)
      setError("Error fetching pet data. Please try again.")
    }
  }

  const handleUpdate = (updatedPet: Pet) => {
    setSelectedPet(updatedPet)
    setIsUpdating(false)
  }

  const handleAdd = (newPet: Pet) => {
    setPets((prevPets) => [...prevPets, { petid: newPet.petid, shortid: newPet.shortid, name: newPet.name }])
    setIsAdding(false)
    setSelectedPet(newPet)
  }

  const handleBackToHome = () => {
    setSelectedPet(null)
    setIsUpdating(false)
    setIsAdding(false)
    fetchPets()
  }

  const filteredPets = pets.filter(
    (pet) => pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || pet.shortid.includes(searchTerm),
  )

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!selectedPet && !isAdding && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Find Your Pet</h2>
          <div className="relative mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter pet name or 6-digit ID"
              className="w-full p-4 pr-12 border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {filteredPets.map((pet) => (
              <button
                key={pet.petid}
                onClick={() => handleFetchPet(pet.shortid)}
                className="bg-white hover:bg-blue-50 text-blue-600 font-semibold py-2 px-4 border border-blue-400 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                {pet.name} ({pet.shortid})
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center justify-center mx-auto transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Plus className="mr-2" />
            Add New Pet
          </button>
        </div>
      )}
      {selectedPet && !isUpdating && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={handleBackToHome}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full mb-4 transition duration-300 ease-in-out"
          >
            Back to Home
          </button>
          <PetProfile pet={selectedPet} />
          {/* <button
            onClick={() => setIsUpdating(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mt-4 block mx-auto transition duration-300 ease-in-out"
          >
            Update Pet Information
          </button> */}
        </div>
      )}
      {isUpdating && selectedPet && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={handleBackToHome}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full mb-4 transition duration-300 ease-in-out"
          >
            Back to Home
          </button>
          {/* <UpdatePetForm pet={selectedPet} onUpdate={handleUpdate} onCancel={() => setIsUpdating(false)} /> */}
        </div>
      )}
      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={handleBackToHome}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full mb-4 transition duration-300 ease-in-out"
          >
            Back to Home
          </button>
          <AddPetForm onAdd={handleAdd} onCancel={() => setIsAdding(false)} />
        </div>
      )}
    </div>
  )
}

