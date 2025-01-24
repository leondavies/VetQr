"use client"

import { useState, useEffect } from "react"
import { supabase } from "../utils/supabase"
import type { Pet, Owner, QRCode, Veterinarian } from "../types/pet"

interface AddPetFormProps {
  onAdd: (pet: Pet) => void
  onCancel: () => void
}

export default function AddPetForm({ onAdd, onCancel }: AddPetFormProps) {
  const [newPet, setNewPet] = useState<Partial<Pet> & { owner: Partial<Owner>; qrcode: Partial<QRCode> }>({
    name: "",
    species: "Dog",
    breed: "",
    age: 0,
    weight: 0,
    owner: {
      name: "",
      contactnumber: "",
      email: "",
      address: "",
    },
    qrcode: {
      codevalue: "",
    },
    vetid: "",
  })
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
      // Insert owner
      const { data: ownerData, error: ownerError } = await supabase
        .from("owner")
        .insert([newPet.owner])
        .select()
        .single()

      if (ownerError) throw ownerError

      // Generate QR code URL
      const qrCodeUrl = `${window.location.origin}/pet/${newPet.qrcode.codevalue}`

      // Insert QR code
      const { data: qrCodeData, error: qrCodeError } = await supabase
        .from("qrcode")
        .insert([{ ...newPet.qrcode, codevalue: qrCodeUrl }])
        .select()
        .single()

      if (qrCodeError) throw qrCodeError

      // Insert pet
      const { data: petData, error: petError } = await supabase
        .from("pet")
        .insert([
          {
            name: newPet.name,
            species: newPet.species,
            breed: newPet.breed,
            age: newPet.age,
            weight: newPet.weight,
            ownerid: ownerData.ownerid,
            qrcodeid: qrCodeData.qrcodeid,
            vetid: newPet.vetid,
            shortid: newPet.qrcode.codevalue,
          },
        ])
        .select(`
          *,
          owner (*),
          qrcode (*),
          veterinarian (*)
        `)
        .single()

      if (petError) throw petError

      onAdd(petData as Pet)
    } catch (error) {
      console.error("Error adding new pet:", error)
      alert("Failed to add new pet. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section?: string) => {
    const { name, value } = e.target
    if (section) {
      setNewPet((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [name]: value,
        },
      }))
    } else {
      setNewPet((prev) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Pet</h2>

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
            value={newPet.name}
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
            value={newPet.species}
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
            value={newPet.breed}
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
            value={newPet.age}
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
            value={newPet.weight}
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
            value={newPet.vetid}
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
            value={newPet.owner.name}
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
            value={newPet.owner.contactnumber}
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
            value={newPet.owner.email}
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
            value={newPet.owner.address}
            onChange={(e) => handleChange(e, "owner")}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-4 mb-2">QR Code</h3>
      <div className="mb-4">
        <label htmlFor="qrCodeValue" className="block mb-2">
          QR Code Value (6-digit ID)
        </label>
        <input
          type="text"
          id="qrCodeValue"
          name="codevalue"
          value={newPet.qrcode.codevalue}
          onChange={(e) => handleChange(e, "qrcode")}
          className="w-full p-2 border rounded"
          required
          pattern="[0-9]{6}"
          title="Please enter a 6-digit number"
          maxLength={6}
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
          Add Pet
        </button>
      </div>
    </form>
  )
}

