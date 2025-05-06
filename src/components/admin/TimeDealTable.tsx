import React from "react";
import { Box } from "@mui/material";
import TimeDealRow from "@/components/admin/TimeDealRow";
import { TimeDeal } from "@/hooks/useTimeDealsWithPagination";

interface TimeDealTableProps {
  timeDeals: TimeDeal[];
  expandedDealId: number | null;
  toggleExpand: (id: number) => void;
}

export default function TimeDealTable({
  timeDeals,
  expandedDealId,
  toggleExpand,
}: TimeDealTableProps) {
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
