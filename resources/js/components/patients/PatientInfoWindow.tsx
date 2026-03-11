import { InfoWindow } from "@react-google-maps/api";
import type { PatientLocation } from "@/types/patient";

interface PatientInfoWindowProps {
    patient: PatientLocation;
    onClose: () => void;
}

export function PatientInfoWindow({ patient, onClose }: PatientInfoWindowProps) {
    return (
        <InfoWindow
            position={{ lat: patient.latitude!, lng: patient.longitude! }}
            onCloseClick={onClose}
        >
            <div className="p-1 text-background">
                <h3 className="text-lg font-bold">{patient.full_name}</h3>
                <p>{patient.address}</p>
            </div>
        </InfoWindow>
    );
}
