import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-svh flex-col items-center pt-6 sm:justify-center sm:pt-0">
            {children}
        </div>
    );
}
