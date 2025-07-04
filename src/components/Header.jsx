import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const user = true;
  return (
    <nav className="py-4 flex justify-between items-center">
      <Link className="flex items-center" to="/">
        <img
          src="/logo.svg"
          alt="website logo"
          className="h-4 sm:h-8 inline-block"
        />
        <span className="ml-2 text-xl sm:text-3xl font-">LabUrl</span>
      </Link>
      <div>
        {!user ? (
          <Button onClick={() => navigate("/auth")}>Login</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-8 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage src="/logo.svg" alt="User Avatar" />
                <AvatarFallback>BG</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Biradar Ganesh</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LinkIcon className="mr-2 w-4 h-4" />
                <span>My Links</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <LogOut className="mr-2 h-4 w-4 text-red-400" />
                <span className="text-red-400">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Header;
