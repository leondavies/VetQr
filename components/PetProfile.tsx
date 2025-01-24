import type { Pet, VetVisit } from "../types/pet"
import { QRCodeSVG } from "qrcode.react"
import AIAnimalInfo from "./AIAnimalInfo"

interface PetProfileProps {
  pet: Pet
}

export default function PetProfile({ pet }: PetProfileProps) {
  const qrCodeUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/pet/${pet.shortid}`

  const displayValue = (value: string | number | undefined | null, defaultText: string, suffix?: string) => {
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
      return defaultText
    }
    return `${value}${suffix || ""}`
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{displayValue(pet.name, "Unnamed Pet")}</h2>
            <p className="text-gray-600">
              {displayValue(pet.species, "Species unknown")} - {displayValue(pet.breed, "Breed unknown")} (ID:{" "}
              {displayValue(pet.shortid, "No ID")})
            </p>
          </div>
          <div className="hidden md:block text-center">
            <QRCodeSVG value={qrCodeUrl} size={100} />
            <p className="text-sm text-gray-500 mt-2">Scan for pet profile</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold">Age</h3>
            <p>{displayValue(pet.age, "Age not recorded", " years")}</p>
          </div>
          <div>
            <h3 className="font-semibold">Weight</h3>
            <p>{displayValue(pet.weight, "Weight not recorded", " kg")}</p>
          </div>
          <div>
            <h3 className="font-semibold">Owner</h3>
            <p>{displayValue(pet.owner?.name, "Owner information not available")}</p>
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
            <p>{displayValue(pet.owner?.contactnumber, "Contact information not provided")}</p>
          </div>
        </div>
        <div className="mt-4 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Medical History</h3>
          {pet.vetvisit && pet.vetvisit.length > 0 ? (
            pet.vetvisit.map((visit: VetVisit, index: number) => (
              <div key={index} className="border-t border-gray-200 py-2 first:border-t-0">
                <p className="font-semibold">
                  {displayValue(
                    visit.visitdate ? new Date(visit.visitdate).toLocaleDateString() : null,
                    "Date not recorded",
                  )}{" "}
                  - Dr. {displayValue(visit.veterinarian?.name, "Veterinarian not specified")}
                </p>
                <p>Diagnosis: {displayValue(visit.medicalhistory?.diagnosis, "No diagnosis recorded")}</p>
                <p>Treatment: {displayValue(visit.medicalhistory?.treatment, "No treatment specified")}</p>
                <p>Medications: {displayValue(visit.medicalhistory?.medications, "No medications listed")}</p>
                <p>Notes: {displayValue(visit.medicalhistory?.notes, "No additional notes")}</p>
              </div>
            ))
          ) : (
            <p>No medical history available</p>
          )}
        </div>
        <AIAnimalInfo species={pet.species} breed={pet.breed || ""} />
        <div className="md:hidden text-center flex flex-col justify-center items-center border-t border-gray-200 pt-4">
          <QRCodeSVG value={qrCodeUrl} size={100} />
          <p className="text-sm text-gray-500 mt-2">Scan for pet profile</p>
        </div>
      </div>
    </div>
  )
}

