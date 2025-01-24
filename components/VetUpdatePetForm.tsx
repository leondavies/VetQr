"use client"

import { useState, useEffect } from "react"
import { supabase } from "../utils/supabase"
import type { Pet, Owner, QRCode, Veterinarian } from "../types/pet"

interface VetUpdatePetFormProps {
  pet: Pet
  onUpdate: (updatedPet: Pet) => void
  onCancel: () => void
}

export default function VetUpdatePetForm({ pet, onUpdate, onCancel }: VetUpdatePetFormProps) {
  const [updatedPet, setUpdatedPet] = useState<Pet>(pet)
  const [vets, setVets] = useState<Veterinarian[]>([])

  useEffect(() => {
    fetchVets()
  }, [])

  const fetchVets = async () => {
    try {
      const { data, error } = await supabase.from("veterinarian").select("*").order("name")
      if (error) throw error
      setVets(data)
    } catch (error) {
      console.error("Error fetching veterinarians:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Update pet
      const { data: petData, error: petError } = await supabase
        .from("pet")
        .update({
          name: updatedPet.name,
          species: updatedPet.species,
          breed: updatedPet.breed,
          age: updatedPet.age,
          weight: updatedPet.weight,
          vetid: updatedPet.vetid,
        })
        .eq("petid", pet.petid)
        .select()
        .single()

      if (petError) throw petError

      // Update owner
      const { error: ownerError } = await supabase
        .from("owner")
        .update({
          name: updatedPet.owner?.name,
          contactnumber: updatedPet.owner?.contactnumber,
          email: updatedPet.owner?.email,
          address: updatedPet.owner?.address,
        })
        .eq("ownerid", pet.ownerid)

      if (ownerError) throw ownerError

      // Update QR code
      const { error: qrCodeError } = await supabase
        .from("qrcode")
        .update({
          codevalue: updatedPet.qrcode?.codevalue,
        })
        .eq("qrcodeid", pet.qrcodeid)

      if (qrCodeError) throw qrCodeError

      onUpdate(petData as Pet)
    } catch (error) {
      console.error("Error updating pet:", error)
      alert("Failed to update pet. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section?: string) => {
    const { name, value } = e.target
    if (section) {
      setUpdatedPet((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [name]: value,
        },
      }))
    } else {
      setUpdatedPet((prev) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Update Pet Information</h2>

      <h3 className="text-xl font-semibold mt-4 mb-2">Pet Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={updatedPet.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="species" className="block mb-2">
            Species
          </label>
          <select
            id="species"
            name="species"
            value={updatedPet.species}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
          </select>
        </div>
        <div>
          <label htmlFor="breed" className="block mb-2">
            Breed
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={updatedPet.breed}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="age" className="block mb-2">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={updatedPet.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={updatedPet.weight}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label htmlFor="vetid" className="block mb-2">
            Veterinarian
          </label>
          <select
            id="vetid"
            name="vetid"
            value={updatedPet.vetid}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a veterinarian</option>
            {vets.map((vet) => (
              <option key={vet.vetid} value={vet.vetid}>
                {vet.name} - {vet.clinicname}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-4 mb-2">Owner Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="ownerName" className="block mb-2">
            Name
          </label>
          <input
            type="text"
            id="ownerName"
            name="name"
            value={updatedPet.owner?.name}
            onChange={(e) => handleChange(e, "owner")}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="ownerContactNumber" className="block mb-2">
            Contact Number
          </label>
          <input
            type="tel"
            id="ownerContactNumber"
            name="contactnumber"
            value={updatedPet.owner?.contactnumber}
            onChange={(e) => handleChange(e, "owner")}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="ownerEmail" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="ownerEmail"
            name="email"
            value={updatedPet.owner?.email}
            onChange={(e) => handleChange(e, "owner")}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="ownerAddress" className="block mb-2">
            Address
          </label>
          <input
            type="text"
            id="ownerAddress"
            name="address"
            value={updatedPet.owner?.address}
            onChange={(e) => handleChange(e, "owner")}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-4 mb-2">QR Code</h3>
      <div className="mb-4">
        <label htmlFor="qrCodeValue" className="block mb-2">
          QR Code Value
        </label>
        <input
          type="text"
          id="qrCodeValue"
          name="codevalue"
          value={updatedPet.qrcode?.codevalue}
          onChange={(e) => handleChange(e, "qrcode")}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Update Pet
        </button>
      </div>
    </form>
  )
}

