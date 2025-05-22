"use client";
import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import ItemCard from "./ItemCard";
import { Swiper } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useCurrentTimeDealItemsQuery } from "@/queries/item";

export default function TimeDealSection() {
  // 타임딜 상품 목록 불러오기
  const { data, isLoading, isError } = useCurrentTimeDealItemsQuery();

  if (isLoading) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography>타임딜 상품을 불러오는 중...</Typography>
      </Box>
    );
  }
  if (isError) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography color="error">
          타임딜 상품을 불러오지 못했습니다.
        </Typography>
      </Box>
    );
  }
  if (!data || data.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography>진행 중인 타임딜 상품이 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #F5F7FA 0%, #B8C6DB 100%)",
        p: { xs: 2, sm: 4 },
        pt: { xs: 2, sm: 2 },
        mb: 4,
        boxShadow: "0 4px 24px 0 rgba(80, 100, 120, 0.06)",
        position: "relative",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={700} color="secondary.main" mb={2}>
          타임딜 상품
        </Typography>
      </Box>
      <Box
        sx={{
          position: "relative",
          px: 4,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Button
          className="swiper-button-prev custom-swiper-nav"
          color="secondary"
          sx={{
            position: "absolute",
            left: -24,
            zIndex: 10,
          }}
        ></Button>
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={3}
          spaceBetween={16}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          style={{ padding: "8px 0" }}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
          }}
        >
          <Stack direction="row" spacing={2}>
            {data.map((timeDealItem) =>
              timeDealItem.items?.map((item) => (
                <ItemCard
                  key={item.itemId}
                  {...item}
                  itemStatus="TIME_DEAL"
                  discountRatio={timeDealItem.discountRatio}
                  endTimeDeal={timeDealItem.endTime}
                />
              ))
            )}
          </Stack>
        </Swiper>
        <Button
          className="swiper-button-next custom-swiper-nav"
          color="secondary"
          sx={{
            position: "absolute",
            right: -24,
            zIndex: 10,
          }}
        ></Button>
      </Box>
    </Box>
  );
}
