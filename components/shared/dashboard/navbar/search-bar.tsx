import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  return (
    <div className="hidden md:flex items-center max-w-md w-full mx-4">
      <div className="relative w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm..."
          className="pl-8 w-full bg-secondary/50 hover:bg-secondary/80 transition-colors"
        />
      </div>
    </div>
  );
};

export default SearchBar;
