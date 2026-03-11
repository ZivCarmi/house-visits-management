import { useMemo, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import type { PatientLocation } from "@/types/patient";
import { PatientInfoWindow } from "@/components/patients/PatientInfoWindow";
import type { UserPosition } from "@/hooks/useMapBounds";

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

function getMapOptions(): google.maps.MapOptions {
    return {
        styles: [
            {
                featureType: "poi",
                elementType: "all",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "road",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "transit",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
        ],
    };
}

interface MapViewProps {
    located: PatientLocation[];
    userPosition: UserPosition | null;
    onMapLoad: (map: google.maps.Map) => void;
    defaultCenter: { lat: number; lng: number };
    defaultZoom: number;
}

export function MapView({
    located,
    userPosition,
    onMapLoad,
    defaultCenter,
    defaultZoom,
}: MapViewProps) {
    const [selectedPatient, setSelectedPatient] = useState<PatientLocation | null>(null);

    const blueDot = useMemo(
        () => ({
            fillColor: "#4285F4",
            fillOpacity: 1,
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
        }),
        []
    );

    const mapOptions = useMemo(() => getMapOptions(), []);

    return (
        <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            mapContainerClassName="rounded-md border"
            options={mapOptions}
            center={defaultCenter}
            zoom={defaultZoom}
            onLoad={onMapLoad}
        >
            {userPosition && (
                <Marker
                    position={userPosition}
                    title="המיקום שלי"
                    icon={blueDot}
                />
            )}
            {located.map((patient) => (
                <Marker
                    key={patient.id}
                    position={{ lat: patient.latitude!, lng: patient.longitude! }}
                    title={patient.full_name}
                    onClick={() => setSelectedPatient(patient)}
                />
            ))}
            {selectedPatient && (
                <PatientInfoWindow
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                />
            )}
        </GoogleMap>
    );
}
