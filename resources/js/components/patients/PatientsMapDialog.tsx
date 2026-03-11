import { useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { usePatientLocations } from "@/hooks/usePatientLocations";
import { useCurrentPosition } from "@/hooks/useCurrentPosition";
import { useMapBounds } from "@/hooks/useMapBounds";
import { MapView } from "@/components/patients/MapView";
import { toasts } from "@/lib/toastMessages";

interface PatientsMapDialogProps {
    open: boolean;
    onClose: () => void;
    patientIds: number[];
}

export function PatientsMapDialog({ open, onClose, patientIds }: PatientsMapDialogProps) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    });

    const { located, failed, isLoading, error, fetchLocations } = usePatientLocations(patientIds);
    const { position: userPosition, isLoading: isLocationLoading } = useCurrentPosition({
        enabled: open,
    });
    const { onMapLoad, defaultCenter, defaultZoom } = useMapBounds(located, userPosition);
    const hasShownFailedToastRef = useRef(false);

    useEffect(() => {
        if (open && patientIds.length > 0) {
            fetchLocations();
        }
    }, [open, patientIds.length]);

    useEffect(() => {
        if (!open) {
            hasShownFailedToastRef.current = false;
            return;
        }
        if (!isLoading && located.length > 0 && failed.length > 0 && !hasShownFailedToastRef.current) {
            toasts.patient.locationsPartiallyFailed(failed);
            hasShownFailedToastRef.current = true;
        }
    }, [open, isLoading, located, failed]);

    const hasNoLocations = !isLoading && !error && located.length === 0;
    const waitingForLocation =
        !isLoading && !error && located.length > 0 && isLocationLoading;
    const readyToShowMap =
        isLoaded &&
        !isLoading &&
        !error &&
        located.length > 0 &&
        !isLocationLoading;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-3xl" aria-describedby="map-description">
                <DialogHeader>
                    <DialogTitle>מיקומי מטופלים במפה</DialogTitle>
                </DialogHeader>
                <div className="min-h-[500px] flex items-center justify-center">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center gap-2 py-12">
                            <Spinner className="size-8" />
                            <p className="text-sm text-muted-foreground">טוען מיקומים...</p>
                        </div>
                    )}
                    {error && (
                        <p className="py-6 text-center text-sm text-destructive">{error}</p>
                    )}
                    {waitingForLocation && (
                        <div className="flex flex-col items-center justify-center gap-2 py-12">
                            <Spinner className="size-8" />
                            <p className="text-sm text-muted-foreground">
                                מאפשרים גישה למיקום — אנא אשר בדפדפן
                            </p>
                        </div>
                    )}
                    {hasNoLocations && (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            לא נמצאו מיקומים להצגה עבור המטופלים שנבחרו.
                            <br />
                            יתכן שכתובת המטופל לא תקינה.
                        </p>
                    )}
                    {readyToShowMap && (
                        <MapView
                            located={located}
                            userPosition={userPosition}
                            onMapLoad={onMapLoad}
                            defaultCenter={defaultCenter}
                            defaultZoom={defaultZoom}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
