"use client";

import React from "react";
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
import ImageWithFallback from "@/components/ImageWithFallback";
import {
  CartItem,
  useCartQuery,
  useDecreaseCartItemMutation,
  useIncreaseCartItemMutation,
  useRemoveCartItemMutation,
} from "@/queries/cart";

// 남은 타임딜 시간 계산 함수
function getRemainTime(endTime: string | null) {
  if (!endTime) return "";
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "종료";
  const min = Math.floor(diff / 60000) % 60;
  const hour = Math.floor(diff / 3600000);
  return `${hour}시간 ${min}분 남음`;
}

export default function CartPage() {
  const router = useRouter();
  const { data: items = [], isLoading } = useCartQuery();
  const increaseMutation = useIncreaseCartItemMutation();
  const decreaseMutation = useDecreaseCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();

  // 총 가격 계산
  const totalPrice = items.reduce(
    (sum: number, item: CartItem) =>
      sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  // 구매하기
  const handleOrder = () => {
    router.push("/order");
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>장바구니를 불러오는 중...</Box>
    );
  }

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
          items.map((item: CartItem) => (
            <Box
              key={item.itemId ?? 0}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderBottom: "1px solid #eee",
              }}
            >
              {/* 상품 이미지 */}
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
                  src={item.imageUrl ?? "/placeholder.png"}
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
                {item.timeDealStatus === "TIME_DEAL" && item.endTimeDeal && (
                  <>
                    <Typography variant="caption" color="error">
                      타임딜 • {getRemainTime(item.endTimeDeal)}
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
                  onClick={() => removeMutation.mutate(item.itemId ?? 0)}
                  sx={{ mb: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Button
                    size="small"
                    onClick={() => decreaseMutation.mutate(item.itemId ?? 0)}
                    disabled={!!item.quantity && item.quantity <= 1}
                  >
                    -
                  </Button>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    inputProps={{
                      min: 1,
                      max: item.stock ?? 99,
                      style: { width: 40, textAlign: "center" },
                      readOnly: true,
                    }}
                    sx={{ mx: 1 }}
                  />
                  <Button
                    size="small"
                    onClick={() => increaseMutation.mutate(item.itemId ?? 0)}
                  >
                    +
                  </Button>
                </Box>
                <Typography fontWeight="bold" fontSize={15}>
                  {((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                  원
                </Typography>
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
