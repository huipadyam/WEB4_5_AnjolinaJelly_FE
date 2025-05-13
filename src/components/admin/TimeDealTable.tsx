import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import TimeDealRow from "@/components/admin/TimeDealRow";
import { TimeDeal } from "@/hooks/useTimeDealsWithPagination";

interface TimeDealTableProps {
  timeDeals: TimeDeal[];
  expandedDealId: number | null;
  toggleExpand: (id: number) => void;
  loading?: boolean;
  isSearching?: boolean;
}

export default function TimeDealTable({
  timeDeals,
  expandedDealId,
  toggleExpand,
  loading = false,
  isSearching = false,
}: TimeDealTableProps) {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "300px",
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" mt={2}>
          타임딜 목록을 불러오는 중...
        </Typography>
      </Box>
    );
  }

  if (timeDeals.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
        }}
      >
        <Typography variant="body1" color="textSecondary">
          {isSearching
            ? "검색 결과가 존재하지 않습니다. 다른 검색어를 입력해보세요."
            : "표시할 타임딜이 없습니다."}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {timeDeals.map((timeDeal) => (
        <Box
          key={timeDeal.timeDealId}
          onClick={() => toggleExpand(timeDeal.timeDealId)}
          sx={{ cursor: "pointer" }}
        >
          <TimeDealRow
            timeDeal={timeDeal}
            isExpanded={expandedDealId === timeDeal.timeDealId}
          />
        </Box>
      ))}
    </>
  );
}
