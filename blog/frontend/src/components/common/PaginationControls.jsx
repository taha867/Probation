import { Button } from "@/components/ui/button";
import { useMemo } from "react";

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
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isPending}
        className="flex items-center gap-1"
      >
        {isPending && currentPage > 1 ? (
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <span>←</span>
        )}
        <span>Prev</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            disabled={isPending}
            className="min-w-[2.5rem]"
          >
            {pageNum}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isPending}
        className="flex items-center gap-1"
      >
        <span>Next</span>
        {isPending && currentPage < totalPages ? (
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <span>→</span>
        )}
      </Button>
    </div>
  );
};

export default PaginationControls;


