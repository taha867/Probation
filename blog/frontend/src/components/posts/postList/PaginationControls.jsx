/**
 * PaginationControls - Presentational component for pagination UI
 * Single responsibility: render page info and navigation buttons.
 */
import { Button } from "@/components/ui/button";

const PaginationControls = ({
  currentPage,
  totalPages,
  isPending,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
        {isPending && <span className="ml-2 text-primary">Loading...</span>}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
        >
          {isPending ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          ) : null}
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
        >
          {isPending ? (
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          ) : null}
          Next
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;


