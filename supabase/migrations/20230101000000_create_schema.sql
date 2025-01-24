-- Create Owner table
CREATE TABLE Owner (
    OwnerID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Name TEXT NOT NULL,
    ContactNumber TEXT,
    Email TEXT,
    Address TEXT
);

-- Create QRCode table
CREATE TABLE QRCode (
    QRCodeID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    CodeValue TEXT UNIQUE NOT NULL,
    CreatedDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Veterinarian table
CREATE TABLE Veterinarian (
    VetID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Name TEXT NOT NULL,
    ClinicName TEXT,
    ContactNumber TEXT,
    Email TEXT
);

-- Create Pet table
CREATE TABLE Pet (
    PetID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Name TEXT NOT NULL,
    Breed TEXT,
    Species TEXT CHECK (Species IN ('Dog', 'Cat')),
    Age INTEGER,
    Weight DECIMAL(5,2),
    OwnerID UUID REFERENCES Owner(OwnerID),
    QRCodeID UUID REFERENCES QRCode(QRCodeID) UNIQUE
);

-- Create VetVisit table
CREATE TABLE VetVisit (
    VisitID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    PetID UUID REFERENCES Pet(PetID),
    VetID UUID REFERENCES Veterinarian(VetID),
    VisitDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    Notes TEXT
);

-- Create MedicalHistory table
CREATE TABLE MedicalHistory (
    MedicalHistoryID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    PetID UUID REFERENCES Pet(PetID),
    VisitID UUID REFERENCES VetVisit(VisitID) UNIQUE,
    Diagnosis TEXT,
    Treatment TEXT,
    Medications TEXT,
    Notes TEXT
);

-- Add indexes for foreign keys
CREATE INDEX idx_pet_owner ON Pet(OwnerID);
CREATE INDEX idx_pet_qrcode ON Pet(QRCodeID);
CREATE INDEX idx_vetvisit_pet ON VetVisit(PetID);
CREATE INDEX idx_vetvisit_vet ON VetVisit(VetID);
CREATE INDEX idx_medicalhistory_pet ON MedicalHistory(PetID);
CREATE INDEX idx_medicalhistory_visit ON MedicalHistory(VisitID);

