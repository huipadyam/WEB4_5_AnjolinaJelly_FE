"use client";

import { Box, Button, Stack, useTheme } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 6,
  onPageChange = () => {},
}: PaginationProps) {
  const theme = useTheme();
  const pagesPerGroup = 10; // 한 그룹당 보여줄 페이지 수

  // 현재 페이지 그룹 계산
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePrevGroup = () => {
    const prevGroupStart = Math.max(1, startPage - pagesPerGroup);
    handlePageChange(prevGroupStart);
  };

  const handleNextGroup = () => {
    const nextGroupStart = Math.min(totalPages, startPage + pagesPerGroup);
    handlePageChange(nextGroupStart);
  };

  return (
    <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {/* 이전 그룹 버튼 */}
        {startPage > 1 && (
          <Button
            variant="outlined"
            size="small"
            onClick={handlePrevGroup}
            sx={{
              minWidth: "36px",
              height: "36px",
              borderRadius: 1.5,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
            }}
          >
            <NavigateBeforeIcon />
          </Button>
        )}

        {/* 페이지 버튼들 */}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "contained" : "outlined"}
            size="small"
            onClick={() => handlePageChange(page)}
            sx={{
              minWidth: "36px",
              height: "36px",
              borderRadius: 1.5,
              color:
                page === currentPage ? "white" : theme.palette.primary.main,
              borderColor:
                page === currentPage
                  ? "transparent"
                  : theme.palette.primary.main,
            }}
          >
            {page}
          </Button>
        ))}

        {/* 다음 그룹 버튼 */}
        {endPage < totalPages && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleNextGroup}
            sx={{
              minWidth: "36px",
              height: "36px",
              borderRadius: 1.5,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
            }}
          >
            <NavigateNextIcon />
          </Button>
        )}
      </Stack>
    </Box>
  );
}
