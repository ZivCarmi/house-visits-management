import { useState, useCallback } from "react";
import axios from "axios";
import type { FailedPatient, PatientLocation, PatientLocationsResponse } from "@/types/patient";

interface UsePatientLocationsResult {
    located: PatientLocation[];
    failed: FailedPatient[];
    isLoading: boolean;
    error: string | null;
    fetchLocations: () => void;
}

export function usePatientLocations(patientIds: number[]): UsePatientLocationsResult {
    const [located, setLocated] = useState<PatientLocation[]>([]);
    const [failed, setFailed] = useState<FailedPatient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLocations = useCallback(async () => {
        if (patientIds.length === 0) {
            setLocated([]);
            setFailed([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get<PatientLocationsResponse>("/patients/locations", { params: { ids: patientIds } });
            setLocated(response.data.located);
            setFailed(response.data.failed);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 422) {
                    setError(err.response.data.message);
                    return;
                }
            }

            setError("לא הצלחנו לטעון את המיקומים. אנא נסה שוב מאוחר יותר");
        } finally {
            setIsLoading(false);
        }
    }, [patientIds]);

    return { located, failed, isLoading, error, fetchLocations };
}