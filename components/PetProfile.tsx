import type { Pet, VetVisit } from "../types/pet"
import { QRCodeSVG } from "qrcode.react"

interface PetProfileProps {
  pet: Pet
}

export default function PetProfile({ pet }: PetProfileProps) {
  const qrCodeUrl = `${window.location.origin}/pet/${pet.shortid}`

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{pet.name}</h2>
            <p className="text-gray-600">
              {pet.species} - {pet.breed} (ID: {pet.shortid})
            </p>
          </div>
          <div className="text-center">
            <QRCodeSVG value={qrCodeUrl} size={100} />
            <p className="text-sm text-gray-500 mt-2">Scan for pet profile</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold">Age</h3>
            <p>{pet.age} years</p>
          </div>
          <div>
            <h3 className="font-semibold">Weight</h3>
            <p>{pet.weight} kg</p>
          </div>
          <div>
            <h3 className="font-semibold">Owner</h3>
            <p>{pet.owner?.name}</p>
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
            <p>{pet.owner?.contactnumber}</p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">QR Code</h3>
          <p>{pet.qrcode?.codevalue}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Medical History</h3>
          {pet.vetvisit?.map((visit: VetVisit, index: number) => (
            <div key={index} className="border-t py-2">
              <p className="font-semibold">
                {new Date(visit.visitdate).toLocaleDateString()} - Dr. {visit.veterinarian?.name}
              </p>
              <p>Diagnosis: {visit.medicalhistory?.diagnosis}</p>
              <p>Treatment: {visit.medicalhistory?.treatment}</p>
              <p>Medications: {visit.medicalhistory?.medications}</p>
              <p>Notes: {visit.medicalhistory?.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

