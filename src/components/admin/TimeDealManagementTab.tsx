"use client";

import React, { useState } from "react";
import Pagination from "@/components/admin/Pagination";
import TimeDealManagementHeader from "@/components/admin/TimeDealManagementHeader";
import TimeDealTable from "@/components/admin/TimeDealTable";
import { useTimeDealsWithPagination } from "@/hooks/useTimeDealsWithPagination";

export default function TimeDealManagementTab() {
  const [expandedDealId, setExpandedDealId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const {
    timeDeals,
    currentPage: timeDealsCurrentPage,
    totalPages: timeDealsTotalPages,
    handlePageChange: handleTimeDealsPageChange,
  } = useTimeDealsWithPagination();

  const toggleExpand = (dealId: number) => {
    setExpandedDealId(expandedDealId === dealId ? null : dealId);
  };

  const filteredTimeDeals = timeDeals.filter((deal) => {
    if (!statusFilter) return true; // 전체
    return deal.status === statusFilter;
  });

  return (
    <>
      <TimeDealManagementHeader
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <TimeDealTable
        timeDeals={filteredTimeDeals}
        expandedDealId={expandedDealId}
        toggleExpand={toggleExpand}
      />

      <Pagination
        currentPage={timeDealsCurrentPage}
        totalPages={timeDealsTotalPages}
        onPageChange={handleTimeDealsPageChange}
      />
    </>
  );
}
