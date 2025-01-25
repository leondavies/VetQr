"use client"

import { useState, useEffect } from "react"
import { supabase } from "../utils/supabase"
import type { Pet, Owner, QRCode, Veterinarian } from "../types/pet"

interface AddPetFormProps {
  onAdd: (pet: Pet) => void
  onCancel: () => void
}

export default function AddPetForm({ onAdd, onCancel }: AddPetFormProps) {
  const [newPet, setNewPet] = useState<Partial<Pet> & { owner: Partial<Owner> }>({
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
    vetid: "",
    imageUrl: "",
  })
  const [vets, setVets] = useState<Veterinarian[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)

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
      setError("Failed to fetch veterinarians. Please try again.")
    }
  }

  const generateUniqueShortId = async (): Promise<string> => {
    while (true) {
      const shortId = Math.floor(100000 + Math.random() * 900000).toString()
      const { data, error } = await supabase.from("pet").select("shortid").eq("shortid", shortId)

      if (error) {
        console.error("Error checking shortid:", error)
        throw error
      }

      if (data.length === 0) {
        return shortId
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const shortId = await generateUniqueShortId()

      // Insert owner
      const { data: ownerData, error: ownerError } = await supabase
        .from("owner")
        .insert([newPet.owner])
        .select()
        .single()

      if (ownerError) throw ownerError

      // Generate QR code URL
      const qrCodeUrl = `${window.location.origin}/pet/${shortId}`

      // Insert QR code
      const { data: qrCodeData, error: qrCodeError } = await supabase
        .from("qrcode")
        .insert([{ codevalue: qrCodeUrl }])
        .select()
        .single()

      if (qrCodeError) throw qrCodeError

      let imageUrl = null
      if (image) {
        const formData = new FormData()
        formData.append("image", image)
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to upload image")
        }
        const data = await response.json()
        imageUrl = data.url
      }

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
            shortid: shortId,
            imageUrl: imageUrl,
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
      setError(error instanceof Error ? error.message : "Failed to add new pet. Please try again.")
    } finally {
      setIsLoading(false)
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Pet</h2>

      <h3 className="text-xl font-semibold mt-4 mb-2">Pet Information</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
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
        <div>
          <label htmlFor="image" className="block mb-2">
            Pet Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-4 mb-2">Owner Information</h3>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Adding Pet..." : "Add Pet"}
        </button>
      </div>
    </form>
  )
}

