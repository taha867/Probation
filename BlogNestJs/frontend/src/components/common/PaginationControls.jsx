import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const PaginationControls = ({
  currentPage,
  totalPages,
  isPending,
  onPageChange,
}) => {
  // Generate page numbers to display (show up to 5 pages around current)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5; // max buttons shown (UX decision)
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="success"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
        className="flex items-center justify-center gap-1.5 min-w-[5.5rem] font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
      >
        {isPending && currentPage > 1 ? (
          <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <span className="leading-none flex items-center h-full">←</span>
        )}
        <span className="leading-none">Prev</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pageNum)}
            disabled={isPending}
            className={cn(
              "min-w-[2.5rem] h-9 transition-all duration-200 border-2",
              pageNum === currentPage 
                ? "border-green-600 text-green-700 font-bold scale-110 shadow-sm z-10" 
                : "text-gray-600 hover:border-green-400 hover:text-green-600 bg-white"
            )}
          >
            {pageNum}
          </Button>
        ))}
      </div>

      <Button
        variant="success"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isPending}
        className="flex items-center justify-center gap-1.5 min-w-[5.5rem] font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
      >
        <span className="leading-none">Next</span>
        {isPending && currentPage < totalPages ? (
          <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <span className="leading-none flex items-center h-full">→</span>
        )}
      </Button>
    </div>
  );
};

export default PaginationControls;


