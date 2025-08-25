import { Button } from "@radix-ui/themes";
import { MenuIcon } from "lucide-react";
import { Link } from "react-router";

interface AppBarProps {
  onToggleSidebar: () => void;
}

export default function AppBar({ onToggleSidebar }: AppBarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-50">
      <Button
        variant="ghost"
        size="2"
        onClick={onToggleSidebar}
        className="mr-4 p-2"
      >
        <MenuIcon size={20} />
      </Button>

      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">
          <Link to="/">@heart-re-up/react-lib</Link>
        </h1>
        <span className="ml-2 text-sm text-gray-500">Demo</span>
      </div>

      <div className="ml-auto">
        <span className="text-sm text-gray-600">@heart-re-up/react-lib</span>
      </div>
    </header>
  );
}
