import type { PatientLocation } from "@/types/patient";
import { useCallback, useEffect, useRef } from "react";

const ISRAEL_CENTER = { lat: 31.5, lng: 34.75 };
const ISRAEL_DEFAULT_ZOOM = 7;

export interface UserPosition {
    lat: number;
    lng: number;
}

function applyBoundsToMap(
    map: google.maps.Map,
    located: PatientLocation[],
    userPosition: UserPosition | null
): void {
    const withCoords = located.filter(
        (p) => p.latitude != null && p.longitude != null
    );
    const hasPoints = withCoords.length > 0 || userPosition !== null;
    if (!hasPoints) return;

    const bounds = new google.maps.LatLngBounds();
    withCoords.forEach((p) =>
        bounds.extend({ lat: p.latitude!, lng: p.longitude! })
    );
    if (userPosition) {
        bounds.extend(userPosition);
    }
    map.fitBounds(bounds, 40);

    if (withCoords.length === 1 && !userPosition) {
        map.setCenter({ lat: withCoords[0].latitude!, lng: withCoords[0].longitude! });
        map.setZoom(14);
    }
}

export function useMapBounds(
    located: PatientLocation[],
    userPosition: UserPosition | null = null
) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const locatedRef = useRef<PatientLocation[]>(located);
    const userPositionRef = useRef<UserPosition | null>(userPosition);
    locatedRef.current = located;
    userPositionRef.current = userPosition;

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        applyBoundsToMap(map, locatedRef.current, userPositionRef.current);
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;
        if (located.length === 0 && !userPosition) return;
        applyBoundsToMap(mapRef.current, located, userPosition);
    }, [located, userPosition]);

    const panToPatient = useCallback((lat: number, lng: number) => {
        mapRef.current?.panTo({ lat, lng });
        mapRef.current?.setZoom(15);
    }, []);

    return { onMapLoad, panToPatient, defaultCenter: ISRAEL_CENTER, defaultZoom: ISRAEL_DEFAULT_ZOOM };
}