import { Link } from "@inertiajs/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuUser = {
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    avatar: string | null;
};

interface UserMenuProps {
    user: UserMenuUser;
}

export function UserMenu({ user }: UserMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                >
                    <Avatar>
                        <AvatarImage
                            src={user?.avatar ?? undefined}
                            alt={user?.full_name}
                        />
                        <AvatarFallback>
                            {user.first_name.charAt(0)}
                            {user.last_name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-fit" align="end">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium text-foreground">
                            {user.full_name}
                        </p>
                        <p className="text-muted-foreground text-xs leading-none">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={route("profile.edit")}>פרופיל</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild variant="destructive">
                        <Link
                            href={route("logout")}
                            method="post"
                            className="w-full"
                        >
                            התנתקות
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

