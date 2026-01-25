import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const PostFilter = ({
  placeholder = "Search posts...",
  onSearch, // Optional override for parent-controlled search
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch = searchParams.get("search") || "";
  
  const [searchValue, setSearchValue] = useState(initialSearch);
  const inputId = "post-search-input";

  // 1. Sync local search value if URL changes (e.g. back button)
  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  // 2. Debounced search logic
  useEffect(() => {
    // Only auto-sync URL if we're on a listing page
    const isListingPage = location.pathname === "/" || location.pathname === "/dashboard";
    if (!isListingPage) return;

    const timeoutId = setTimeout(() => {
      const query = searchValue.trim();
      const currentQuery = searchParams.get("search") || "";
      
      if (query !== currentQuery) {
        if (query) {
          setSearchParams({ search: query }, { replace: true });
        } else if (currentQuery) {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete("search");
          setSearchParams(newParams, { replace: true });
        }
        if (onSearch) onSearch(query);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, location.pathname, setSearchParams, searchParams, onSearch]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchValue.trim();
    
    // Call optional callback (e.g. to close a menu)
    if (onSearch) onSearch(query);

    // Global navigation: if not on a listing page, redirect to home with the search query
    if (location.pathname !== "/" && location.pathname !== "/dashboard") {
      if (query) {
        navigate(`/?search=${encodeURIComponent(query)}`);
      } else {
        navigate("/");
      }
    } else {
      // Immediate sync if already on listing page (skips debounce)
      if (query) {
        setSearchParams({ search: query });
      } else {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("search");
        setSearchParams(newParams);
      }
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full relative group">
      <Input
        id={inputId}
        name="search"
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearchChange}
        className="flex-1 pl-10 h-9 md:h-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-full w-full transition-all group-hover:bg-white group-hover:border-slate-300"
        aria-label="Search posts"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors">
        <Search className="h-4 w-4" />
      </div>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 md:hidden"
        aria-label="Search posts"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default PostFilter;
