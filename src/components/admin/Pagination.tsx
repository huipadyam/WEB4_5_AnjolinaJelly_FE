"use client";

import { Box, Button, Stack, useTheme } from "@mui/material";

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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
      <Stack direction="row" spacing={1}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
      </Stack>
    </Box>
  );
}
