import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ProductCard from "./ProductCard";
import TimeDealProductCardInGrid from "./TimeDealProductCardInGrid";
import { ItemResponse } from "../api/zzirit/models/ItemResponse";

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

// 더미 데이터
const products: (ItemResponse & {
  image: string;
  originalPrice?: number;
  discount?: number;
})[] = [
  {
    itemId: 1,
    name: "프리미엄 찌릿 청소기",
    type: "가전",
    brand: "찌릿",
    quantity: 100,
    price: 99000,
    timeDealStatus: "TIME_DEAL",
    endTimeDeal: new Date(Date.now() + 1 * 60 * 60 * 1000),
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
    endTimeDeal: new Date(Date.now() + 45 * 60 * 1000),
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
    endTimeDeal: new Date(Date.now() + 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
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
    timeDealStatus: "NONE",
    image: "/sample4.jpg",
  },
  {
    itemId: 5,
    name: "찌릿 스마트워치",
    type: "전자기기",
    brand: "찌릿",
    quantity: 60,
    price: 119000,
    timeDealStatus: "NONE",
    image: "/sample5.jpg",
  },
  {
    itemId: 6,
    name: "찌릿 프리미엄 텀블러",
    type: "주방용품",
    brand: "찌릿",
    quantity: 120,
    price: 25000,
    timeDealStatus: "NONE",
    image: "/sample6.jpg",
  },
  {
    itemId: 7,
    name: "찌릿 유기농 바나나",
    type: "식품",
    brand: "찌릿",
    quantity: 300,
    price: 9900,
    timeDealStatus: "NONE",
    image: "/sample7.jpg",
  },
  {
    itemId: 8,
    name: "찌릿 무선 충전기",
    type: "전자기기",
    brand: "찌릿",
    quantity: 70,
    price: 35000,
    timeDealStatus: "NONE",
    image: "/sample8.jpg",
  },
];

export default function ProductGridSection() {
  // TODO: react-query로 무한스크롤 구현 (현재는 1페이지만)
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(...)
  // useIntersectionObserver로 스크롤 하단 감지 후 fetchNextPage()

  return (
    <Box sx={{ my: 6 }}>
      <Grid container spacing={3}>
        {products.map((product) => {
          if (product.timeDealStatus === "TIME_DEAL") {
            return (
              <Grid key={product.itemId}>
                <TimeDealProductCardInGrid
                  image={product.image}
                  name={product.name ?? ""}
                  category={product.type ?? ""}
                  originalPrice={product.originalPrice ?? 0}
                  dealPrice={product.price ?? 0}
                  discount={product.discount ?? 0}
                  timeLeft={getTimeLeftString(
                    product.endTimeDeal ?? new Date()
                  )}
                />
              </Grid>
            );
          } else {
            return (
              <Grid key={product.itemId}>
                <ProductCard
                  image={product.image}
                  name={product.name ?? ""}
                  category={product.type ?? ""}
                  price={product.price ?? 0}
                />
              </Grid>
            );
          }
        })}
      </Grid>
    </Box>
  );
}
