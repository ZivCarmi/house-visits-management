import { Link } from "@inertiajs/react";
import type { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC]">
            <header className="border-b border-[#e3e3e0] dark:border-[#3E3E3A] bg-white/80 dark:bg-[#161615]/80 backdrop-blur">
                <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-6 py-4">
                    <nav className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium">
                            ניהול ביקורי בית
                        </Link>
                        <Link
                            href="/patients"
                            className="text-sm text-[#706f6c] dark:text-[#A1A09A] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                        >
                            מטופלים
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-6 py-6">
                <div>{children}</div>
            </main>
        </div>
    );
}
