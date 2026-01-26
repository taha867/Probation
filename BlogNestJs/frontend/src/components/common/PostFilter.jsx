import { useState, useEffect, useId, useTransition, useCallback } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Simple debounce utility for the search action
const useDebounce = (callback, delay) => {
  const [timer, setTimer] = useState(null);

  return useCallback(
    (...args) => {
      if (timer) clearTimeout(timer);
      const newTimer = setTimeout(() => {
        callback(...args);
      }, delay);
      setTimer(newTimer);
    },
    [callback, delay, timer]
  );
};

const PostFilter = ({
  placeholder = "Search posts...",
  onSearch, // Optional override for parent-controlled search
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const inputId = useId();
  const [isPending, startTransition] = useTransition();


  const initialSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(initialSearch);

  // Sync local state when URL changes (e.g., back button)
  useEffect(() => {
    const urlQuery = searchParams.get("search") || "";
    if (urlQuery !== searchValue) {
      setSearchValue(urlQuery);
    }
  }, [searchParams]);

  // Actual search logic (updates URL)
  const performSearch = useCallback(
    (query) => {
        const isListingPage = location.pathname === "/" || location.pathname === "/dashboard";
        
        // Navigation logic for non-listing pages
        if (!isListingPage) {
            if (query) {
                navigate(`/?search=${encodeURIComponent(query)}`);
            } else {
                navigate("/");
            }
            if (onSearch) onSearch(query);
            return;
        }

        // URL update logic using transition for smoother UI
        startTransition(() => {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                if (query) {
                    newParams.set("search", query);
                } else {
                    newParams.delete("search");
                }
                // Reset page to 1 on new search
                if (newParams.get("page")) {
                    newParams.set("page", "1");
                }
                return newParams;
            }, { replace: true });
            
            if (onSearch) onSearch(query);
        });
    },
    [location.pathname, navigate, onSearch, setSearchParams]
  );

  // Debounced wrapper for typing
  const debouncedSearch = useDebounce(performSearch, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchValue);
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
        <Search className={`h-4 w-4 ${isPending ? "animate-pulse text-blue-500" : ""}`} />
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
