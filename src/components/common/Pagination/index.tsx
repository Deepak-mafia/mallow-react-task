
import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface Props {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

const Pagination = ({ current, total, onChange }: Props) => {
  // Helper to generate page numbers with ellipsis
  const getPages = () => {
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', total);
      } else if (current >= total - 3) {
        pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }
    return pages;
  };

  return (
    <ShadPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => {
              e.preventDefault();
              if (current > 1) onChange(current - 1);
            }}
            aria-disabled={current === 1}
          />
        </PaginationItem>
        {getPages().map((page, idx) =>
          page === '...' ? (
            <PaginationItem key={idx}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={idx}>
              <PaginationLink
                href="#"
                isActive={page === current}
                onClick={e => {
                  e.preventDefault();
                  if (page !== current) onChange(Number(page));
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => {
              e.preventDefault();
              if (current < total) onChange(current + 1);
            }}
            aria-disabled={current === total}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
};

export default Pagination; 