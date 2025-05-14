import TimeDealSection from "@/components/TimeDealSection";
import ProductGridSection from "@/components/ProductGridSection";
import { Box } from "@mui/material";
import Filter from "@/components/Filter";

export default function Home() {
  return (
    <>
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
    </>
  );
}
