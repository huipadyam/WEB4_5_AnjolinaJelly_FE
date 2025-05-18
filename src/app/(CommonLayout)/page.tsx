"use client";
import TimeDealSection from "@/components/TimeDealSection";
import ProductGridSection from "@/components/ProductGridSection";
import { Box } from "@mui/material";
import Filter from "@/components/Filter";
import { Suspense } from "react";
export default function Home() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <TimeDealSection />
      <Box
        display="flex"
        sx={{
          px: { xs: 0, md: 4 },
        }}
      >
        {/* 왼쪽 필터 (스티키) */}
        <Box sx={{}}>
          <Filter />
        </Box>
        <ProductGridSection />
      </Box>
    </Suspense>
  );
}
