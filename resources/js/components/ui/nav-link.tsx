import * as React from "react";

import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";

function NavLink({ className, ...props }: React.ComponentProps<typeof Link>) {
    return (
        <Link
            data-slot="nav-link"
            data-active={props.href === usePage().url}
            className={cn(
                "text-muted-foreground hover:text-primary data-[active=true]:text-primary transition-colors",
                className,
            )}
            {...props}
        />
    );
}

export { NavLink };
