import { GlassButton } from './GlassButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <GlassButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="ghost"
        >
          Previous
        </GlassButton>
        <GlassButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="ghost"
        >
          Next
        </GlassButton>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-secondary-foreground">
            Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-2" aria-label="Pagination">
            <GlassButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="ghost"
              className="px-2"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </GlassButton>
            {/* Generate page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <GlassButton
                key={page}
                onClick={() => onPageChange(page)}
                variant={currentPage === page ? 'primary' : 'ghost'}
                className="px-4"
              >
                {page}
              </GlassButton>
            ))}
            <GlassButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="ghost"
              className="px-2"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </GlassButton>
          </nav>
        </div>
      </div>
    </div>
  );
};
