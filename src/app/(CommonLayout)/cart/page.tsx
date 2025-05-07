"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { ItemResponse } from "@/api/zzirit";
import mockItems from "@/api/zzirit/mocks/items.json";
import ImageWithFallback from "@/components/ImageWithFallback";

// CartItem 타입만 이 파일 내에서 선언
interface CartItem extends ItemResponse {
  count: number;
}

const LOCAL_KEY = "cart_items";

function getRemainTime(endTime: string | null) {
  if (!endTime) return "";
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "종료";
  const min = Math.floor(diff / 60000) % 60;
  const hour = Math.floor(diff / 3600000);
  return `${hour}시간 ${min}분 남음`;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  // localStorage에서 count 정보 불러오기
  const getLocalCounts = (): Record<number, number> => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    } catch {
      return {};
    }
  };

  // count 정보 localStorage에 저장
  const setLocalCounts = (counts: Record<number, number>) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(counts));
  };

  // mock 데이터 fetch + count 동기화
  useEffect(() => {
    const data = mockItems.result.content.slice(
      0,
      2
    ) as unknown as ItemResponse[];

    const localCounts = getLocalCounts();
    // 서버 데이터와 localStorage 동기화
    const validCounts: Record<number, number> = {};
    const cartItems: CartItem[] = data.map((item) => {
      const count = localCounts[item.itemId ?? 0] ?? 1;
      validCounts[item.itemId ?? 0] = count;
      return { ...item, count };
    });
    // localStorage에 없는 id는 1로, 서버에 없는 id는 제거
    setLocalCounts(validCounts);
    setItems(cartItems);
  }, []);

  // 개수 변경
  const handleCountChange = (itemId: number, count: number) => {
    setItems((prev) =>
      prev.map((item) => (item.itemId === itemId ? { ...item, count } : item))
    );
    const localCounts = getLocalCounts();
    localCounts[itemId] = count;
    setLocalCounts(localCounts);
  };

  // 아이템 삭제
  const handleRemove = (itemId: number) => {
    setItems((prev) => prev.filter((item) => item.itemId !== itemId));
    const localCounts = getLocalCounts();
    delete localCounts[itemId];
    setLocalCounts(localCounts);
  };

  // 총 가격 계산
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.count,
    0
  );

  // 구매하기
  const handleOrder = () => {
    router.push("/order"); // 주문 페이지로 이동
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        장바구니
      </Typography>
      <Paper sx={{ flex: 1, overflowY: "auto", maxHeight: 400, mb: 2 }}>
        {items.length === 0 ? (
          <Typography sx={{ p: 3, textAlign: "center" }}>
            장바구니가 비어있습니다.
          </Typography>
        ) : (
          items.map((item) => (
            <Box
              key={item.itemId ?? 0}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderBottom: "1px solid #eee",
              }}
            >
              {/* 상품 이미지 (임시) */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mr: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                <ImageWithFallback
                  src="/placeholder.png"
                  alt={item.name ?? ""}
                  style={{ objectFit: "contain" }}
                  width={80}
                  height={80}
                />
              </Box>
              {/* 상품 정보 */}
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight="bold">{item.name ?? ""}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {(item.type ?? "") + " | " + (item.brand ?? "")}
                </Typography>
                {item.timeDealStatus === "TIME_DEAL" && (
                  <>
                    <Typography variant="caption" color="error">
                      타임딜 •{" "}
                      {getRemainTime(
                        item.endTimeDeal
                          ? typeof item.endTimeDeal === "string"
                            ? item.endTimeDeal
                            : item.endTimeDeal.toISOString()
                          : null
                      )}
                    </Typography>
                    <Typography mt={1}>
                      <b>{(item.price ?? 0).toLocaleString()}원</b>
                      <span
                        style={{ marginLeft: 8, color: "#888", fontSize: 13 }}
                      >
                        남은수량: {item.quantity ?? 0}
                      </span>
                    </Typography>
                  </>
                )}
              </Box>
              {/* 개수 조절 및 삭제 */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  minWidth: 90,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleRemove(item.itemId ?? 0)}
                  sx={{ mb: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <TextField
                    type="number"
                    size="small"
                    value={item.count}
                    inputProps={{
                      min: 1,
                      max: item.quantity ?? 1,
                      style: { width: 40, textAlign: "center" },
                    }}
                    onChange={(e) => {
                      const v = Math.max(
                        1,
                        Math.min(item.quantity ?? 1, Number(e.target.value))
                      );
                      handleCountChange(item.itemId ?? 0, v);
                    }}
                    sx={{ mb: 1 }}
                  />
                  <Typography fontWeight="bold" fontSize={15}>
                    {((item.price ?? 0) * item.count).toLocaleString()}원
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Paper>
      {/* 총 가격 및 구매 버튼 */}
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
      >
        <Typography fontWeight="bold">총 합계</Typography>
        <Typography fontWeight="bold" fontSize={18}>
          {totalPrice.toLocaleString()}원
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={items.length === 0}
        onClick={handleOrder}
        sx={{ mb: 2 }}
      >
        구매하기
      </Button>
    </Box>
  );
}
