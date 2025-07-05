import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getUserProfile, logout } = useAuth();
  const userProfile = getUserProfile();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
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
        {!isAuthenticated ? (
          <Button
            onClick={() => navigate("/auth")}
            className="bg-primary-orange text-white hover:bg-white hover:text-primary-orange"
          >
            Login
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-8 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage
                  src={userProfile?.profilePicture || null}
                  alt="User Avatar"
                />
                <AvatarFallback>
                  {(userProfile?.username || userProfile?.name)
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {userProfile?.username ||
                  userProfile?.name ||
                  userProfile?.email ||
                  "User"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                <LinkIcon className="mr-2 w-4 h-4" />
                <span>My Links</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400" onClick={handleLogout}>
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
