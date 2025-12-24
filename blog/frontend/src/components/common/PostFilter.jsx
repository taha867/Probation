import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const PostFilter = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search posts...",
  isPending = false,
}) => {
  const inputId = "post-search-input";
  
  return (
    <form onSubmit={onSubmit} className="flex gap-2 w-full">
      <Input
        id={inputId}
        name="search"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1"
        aria-label="Search posts"
      />
      <Button
        type="submit"
        variant="outline"
        size="icon"
        disabled={isPending}
        aria-label="Search posts"
      >
        {isPending ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export default PostFilter;


