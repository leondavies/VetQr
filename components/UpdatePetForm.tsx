import { useState, useEffect } from "react"
import type { Pet } from "../types/pet"
import { supabase } from "../utils/supabase"

interface UpdatePetFormProps {
  pet: Pet
  onUpdate: (pet: Pet) => void
  onCancel: () => void
}

export default function UpdatePetForm({ pet, onUpdate, onCancel }: UpdatePetFormProps) {
  const [updatedPet, setUpdatedPet] = useState<Pet>(pet)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Update QR code URL
      const qrCodeUrl = `${window.location.origin}/pet/${updatedPet.shortid}`
      const { error: qrCodeError } = await supabase
        .from("qrcode")
        .update({ codevalue: qrCodeUrl })
        .eq("qrcodeid", pet.qrcodeid)

      if (qrCodeError) throw qrCodeError

      // Update pet
      const { data, error } = await supabase
        .from("pet")
        .update({
          name: updatedPet.name,
          breed: updatedPet.breed,
          age: updatedPet.age,
          weight: updatedPet.weight,
          shortid: updatedPet.shortid,
        })
        .eq("petid", pet.petid)
        .select()
        .single()

      if (error) throw error

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

      onUpdate(data)
    } catch (error) {
      console.error("Error updating pet:", error)
      alert("Failed to update pet. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, section?: string) => {
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
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={updatedPet.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Breed</label>
          <input
            type="text"
            name="breed"
            value={updatedPet.breed}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={updatedPet.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Weight</label>
          <input
            type="number"
            name="weight"
            value={updatedPet.weight}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            step="0.1"
          />
        </div>
        <div>
          <label className="block mb-2">QR Code Value (6-digit ID)</label>
          <input
            type="text"
            name="shortid"
            value={updatedPet.shortid}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            pattern="[0-9]{6}"
            title="Please enter a 6-digit number"
            maxLength={6}
          />
        </div>
      </div>
      <h3 className="text-xl font-semibold mt-4 mb-2">Owner Information</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={updatedPet.owner?.name}
            onChange={(e) => handleChange(e, "owner")}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Contact Number</label>
          <input
            type="tel"
            name="contactnumber"
            value={updatedPet.owner?.contactnumber}
            onChange={(e) => handleChange(e, "owner")}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={updatedPet.owner?.email}
            onChange={(e) => handleChange(e, "owner")}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={updatedPet.owner?.address}
            onChange={(e) => handleChange(e, "owner")}
            className="w-full p-2 border rounded"
          />
        </div>
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
          Save Changes
        </button>
      </div>
    </form>
  )
}

