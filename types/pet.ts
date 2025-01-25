export interface Pet {
  petid: string
  shortid: string
  name: string
  breed?: string
  species: "Dog" | "Cat"
  age?: number
  weight?: number
  ownerid: string
  qrcodeid: string
  vetid: string
  imageUrl?: string
  owner?: Owner
  qrcode?: QRCode
  veterinarian?: Veterinarian
  vetvisit?: VetVisit[]
}

export interface Owner {
  ownerid: string
  name: string
  contactnumber?: string
  email?: string
  address?: string
}

export interface QRCode {
  qrcodeid: string
  codevalue: string
  createddate: string
}

export interface Veterinarian {
  vetid: string
  name: string
  clinicname?: string
  contactnumber?: string
  email?: string
}

export interface VetVisit {
  visitid: string
  petid: string
  vetid: string
  visitdate: string
  notes?: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"

  veterinarian?: Veterinarian
  medicalhistory?: MedicalHistory
}

export interface MedicalHistory {
  medicalhistoryid: string
  petid: string
  visitid: string
  diagnosis?: string
  treatment?: string
  medications?: string
  notes?: string
}

