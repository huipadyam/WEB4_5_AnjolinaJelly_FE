"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRouter } from "next/navigation";
import { ItemResponse } from "../api/zzirit/models/ItemResponse";
import ImageWithFallback from "./ImageWithFallback";

// 더미 데이터
const timeDealProducts: (ItemResponse & {
  image: string;
  originalPrice: number;
  discount: number;
})[] = [
  {
    itemId: 1,
    name: "프리미엄 찌릿 청소기",
    type: "가전",
    brand: "찌릿",
    quantity: 100,
    price: 99000,
    timeDealStatus: "TIME_DEAL",
    endTimeDeal: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1시간 뒤
    image: "/sample1.jpg",
    originalPrice: 129000,
    discount: 23,
  },
  {
    itemId: 2,
    name: "찌릿 무선 이어폰",
    type: "전자기기",
    brand: "찌릿",
    quantity: 50,
    price: 39000,
    timeDealStatus: "TIME_DEAL",
    endTimeDeal: new Date(Date.now() + 45 * 60 * 1000), // 45분 뒤
    image: "/sample2.jpg",
    originalPrice: 59000,
    discount: 34,
  },
  {
    itemId: 3,
    name: "찌릿 유기농 사과",
    type: "식품",
    brand: "찌릿",
    quantity: 200,
    price: 17900,
    timeDealStatus: "TIME_DEAL",
    endTimeDeal: new Date(Date.now() + 2 * 60 * 60 * 1000 + 10 * 60 * 1000), // 2시간 10분 뒤
    image: "/sample3.jpg",
    originalPrice: 25000,
    discount: 28,
  },
  {
    itemId: 4,
    name: "찌릿 프리미엄 베개",
    type: "생활용품",
    brand: "찌릿",
    quantity: 80,
    price: 29900,
    timeDealStatus: "TIME_DEAL",
    endTimeDeal: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1시간 뒤
    image: "/sample4.jpg",
    originalPrice: 45000,
    discount: 33,
  },
  {
    itemId: 5,
    name: "찌릿 스마트워치",
    type: "전자기기",
    brand: "찌릿",
    quantity: 60,
    price: 119000,
    timeDealStatus: "TIME_DEAL",
    endTimeDeal: new Date(Date.now() + 3 * 60 * 60 * 1000 + 12 * 60 * 1000), // 3시간 12분 뒤
    image: "/sample5.jpg",
    originalPrice: 159000,
    discount: 25,
  },
];

const ITEMS_PER_SLIDE = 3;

function getTimeLeftString(endTimeDeal: Date): string {
  const now = new Date();
  const diff = Math.max(0, endTimeDeal.getTime() - now.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// 남은 시간을 클라이언트에서만 갱신하는 커스텀 훅
function useTimeLeft(endTimeDeal: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeftString(endTimeDeal));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeftString(endTimeDeal));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTimeDeal]);

  return timeLeft;
}

// 개별 타임딜 카드 컴포넌트
function TimeDealCard({
  product,
}: {
  product: (typeof timeDealProducts)[number];
}) {
  const [mounted, setMounted] = useState(false);
  const timeLeft = useTimeLeft(product.endTimeDeal!);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card
      key={product.itemId}
      sx={{
        minWidth: 0,
        flex: 1,
        borderRadius: 3,
        boxShadow: "0 2px 8px 0 rgba(80, 100, 120, 0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <ImageWithFallback
        src={product.image}
        alt={product.name ?? ""}
        fallbackKey={product.image}
        style={{ height: 140, objectFit: "cover" }}
      />
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccessTimeIcon color="error" fontSize="small" />
          <Typography variant="body2" color="error" fontWeight={700}>
            {mounted ? timeLeft : null}
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            fontWeight={700}
            sx={{
              ml: "auto",
              bgcolor: "#E3F2FD",
              px: 1,
              borderRadius: 1,
            }}
          >
            {product.discount}% 할인
          </Typography>
        </Stack>
        <Typography variant="subtitle1" fontWeight={600} mt={1} noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.type}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={1} mt={1}>
          <Typography variant="body1" fontWeight={700} color="primary.main">
            {product.price?.toLocaleString()}원
          </Typography>
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ textDecoration: "line-through" }}
          >
            {product.originalPrice?.toLocaleString()}원
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function TimeDealSection() {
  const [slide, setSlide] = useState(0);
  const router = useRouter();

  // 4초마다 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(
        (prev) =>
          (prev + 1) % Math.ceil(timeDealProducts.length / ITEMS_PER_SLIDE)
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setSlide(
      (prev) =>
        (prev - 1 + Math.ceil(timeDealProducts.length / ITEMS_PER_SLIDE)) %
        Math.ceil(timeDealProducts.length / ITEMS_PER_SLIDE)
    );
  };
  const handleNext = () => {
    setSlide(
      (prev) =>
        (prev + 1) % Math.ceil(timeDealProducts.length / ITEMS_PER_SLIDE)
    );
  };

  const startIdx = slide * ITEMS_PER_SLIDE;
  const visibleProducts = timeDealProducts.slice(
    startIdx,
    startIdx + ITEMS_PER_SLIDE
  );

  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #F5F7FA 0%, #B8C6DB 100%)",
        borderRadius: 4,
        p: { xs: 2, sm: 4 },
        my: 4,
        boxShadow: "0 4px 24px 0 rgba(80, 100, 120, 0.06)",
        position: "relative",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" fontWeight={700} color="primary.main">
          타임딜 상품
        </Typography>
        <Button
          variant="text"
          sx={{ fontWeight: 600, color: "primary.main" }}
          onClick={() => router.push("/products/time-deal")}
        >
          전체보기
        </Button>
      </Stack>
      <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
        <IconButton onClick={handlePrev} sx={{ mr: 1 }}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
          {visibleProducts.map((product) => (
            <TimeDealCard key={product.itemId} product={product} />
          ))}
        </Box>
        <IconButton onClick={handleNext} sx={{ ml: 1 }}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
