import { useCallback, useEffect, useState } from "react";

export interface CurrentPosition {
    lat: number;
    lng: number;
}

interface UseCurrentPositionOptions {
    enabled?: boolean;
}

interface UseCurrentPositionResult {
    position: CurrentPosition | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useCurrentPosition(
    options: UseCurrentPositionOptions = {}
): UseCurrentPositionResult {
    const { enabled = true } = options;
    const [position, setPosition] = useState<CurrentPosition | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPosition = useCallback(() => {
        if (!navigator?.geolocation) {
            setError("Geolocation is not supported.");
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                setIsLoading(false);
            },
            () => {
                setError("Could not get your location.");
                setIsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    }, []);

    useEffect(() => {
        if (enabled) {
            fetchPosition();
        }
    }, [enabled, fetchPosition]);

    return { position, isLoading, error, refetch: fetchPosition };
}
