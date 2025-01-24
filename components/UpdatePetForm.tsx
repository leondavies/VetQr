// import { useState } from "react"
// import type { Pet } from "../types/pet"
// import { supabase } from "../utils/supabase"

// interface UpdatePetFormProps {
//   pet: Pet
//   onUpdate: (pet: Pet) => void
//   onCancel: () => void
// }

// export default function UpdatePetForm({ pet, onUpdate, onCancel }: UpdatePetFormProps) {
//   const [updatedPet, setUpdatedPet] = useState<Pet>(pet)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError(null)

//     try {
//       // Ensure all required IDs are present
//       if (!pet.petid || !pet.ownerid || !pet.qrcodeid) {
//         throw new Error("Missing required ID fields")
//       }

//       // Update QR code URL
//       const qrCodeUrl = `${window.location.origin}/pet/${updatedPet.shortid}`
//       const { error: qrCodeError } = await supabase
//         .from("qrcode")
//         .update({ codevalue: qrCodeUrl })
//         .eq("qrcodeid", pet.qrcodeid)

//       if (qrCodeError) throw qrCodeError

//       // Update pet
//       const { data, error: petError } = await supabase
//         .from("pet")
//         .update({
//           name: updatedPet.name,
//           breed: updatedPet.breed,
//           age: updatedPet.age,
//           weight: updatedPet.weight,
//           shortid: updatedPet.shortid,
//         })
//         .eq("petid", pet.petid)
//         .select()
//         .single()

//       if (petError) throw petError

//       // Update owner
//       const { error: ownerError } = await supabase
//         .from("owner")
//         .update({
//           name: updatedPet.owner?.name,
//           contactnumber: updatedPet.owner?.contactnumber,
//           email: updatedPet.owner?.email,
//           address: updatedPet.owner?.address,
//         })
//         .eq("ownerid", pet.ownerid)

//       if (ownerError) throw ownerError

//       onUpdate(data)
//     } catch (error) {
//       console.error("Error updating pet:", error)
//       setError(error instanceof Error ? error.message : "Failed to update pet. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, section?: string) => {
//     const { name, value } = e.target
//     if (section) {
//       setUpdatedPet((prev) => ({
//         ...prev,
//         [section]: {
//           ...prev[section as keyof typeof prev],
//           [name]: value,
//         },
//       }))
//     } else {
//       setUpdatedPet((prev) => ({ ...prev, [name]: value }))
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-4">Update Pet Information</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label htmlFor="name" className="block mb-2 font-semibold">
//             Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={updatedPet.name}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="breed" className="block mb-2 font-semibold">
//             Breed
//           </label>
//           <input
//             type="text"
//             id="breed"
//             name="breed"
//             value={updatedPet.breed}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="age" className="block mb-2 font-semibold">
//             Age
//           </label>
//           <input
//             type="number"
//             id="age"
//             name="age"
//             value={updatedPet.age}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//             min="0"
//           />
//         </div>
//         <div>
//           <label htmlFor="weight" className="block mb-2 font-semibold">
//             Weight (kg)
//           </label>
//           <input
//             type="number"
//             id="weight"
//             name="weight"
//             value={updatedPet.weight}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//             step="0.1"
//             min="0"
//           />
//         </div>
//         <div>
//           <label htmlFor="shortid" className="block mb-2 font-semibold">
//             QR Code Value (6-digit ID)
//           </label>
//           <input
//             type="text"
//             id="shortid"
//             name="shortid"
//             value={updatedPet.shortid}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             pattern="[0-9]{6}"
//             title="Please enter a 6-digit number"
//             maxLength={6}
//             required
//           />
//         </div>
//       </div>
//       <h3 className="text-xl font-semibold mt-6 mb-4">Owner Information</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <label htmlFor="ownerName" className="block mb-2 font-semibold">
//             Name
//           </label>
//           <input
//             type="text"
//             id="ownerName"
//             name="name"
//             value={updatedPet.owner?.name}
//             onChange={(e) => handleChange(e, "owner")}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="contactnumber" className="block mb-2 font-semibold">
//             Contact Number
//           </label>
//           <input
//             type="tel"
//             id="contactnumber"
//             name="contactnumber"
//             value={updatedPet.owner?.contactnumber}
//             onChange={(e) => handleChange(e, "owner")}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="email" className="block mb-2 font-semibold">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={updatedPet.owner?.email}
//             onChange={(e) => handleChange(e, "owner")}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="address" className="block mb-2 font-semibold">
//             Address
//           </label>
//           <input
//             type="text"
//             id="address"
//             name="address"
//             value={updatedPet.owner?.address}
//             onChange={(e) => handleChange(e, "owner")}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//       </div>
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//           <strong className="font-bold">Error:</strong>
//           <span className="block sm:inline"> {error}</span>
//         </div>
//       )}
//       <div className="flex justify-end gap-4">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           disabled={isLoading}
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           disabled={isLoading}
//         >
//           {isLoading ? "Saving..." : "Save Changes"}
//         </button>
//       </div>
//     </form>
//   )
// }

