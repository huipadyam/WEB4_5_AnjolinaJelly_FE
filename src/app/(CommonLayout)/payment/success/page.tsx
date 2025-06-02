"use client";

import { useSearchParams } from "next/navigation";
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import { useConfirmPayment, useGetMyOrders } from "@/queries/order";
import { useMemo } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") as string;
  const paymentKey = searchParams.get("paymentKey") as string;
  const amount = searchParams.get("amount") as string;

  const { isLoading, isError } = useConfirmPayment(orderId, paymentKey, amount);

  const { data: orders, refetch } = useGetMyOrders();

  const order = useMemo(() => {
    if (!orders || !orderId) return null;

    const foundOrder = orders.find((order) => order.orderNumber === orderId);

    if (!foundOrder) {
      const maxAttempts = 30;
      const attemptCount = orders.length;

      if (attemptCount < maxAttempts) {
        setTimeout(() => {
          refetch();
        }, 2000);
      }
    }

    return foundOrder;
  }, [orders, orderId, refetch]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    throw new Error("결제 확인 중 오류가 발생했습니다.");
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        결제가 성공적으로 완료되었습니다!
      </Typography>
      <Typography color="text.secondary" mb={3}>
        주문이 정상적으로 접수되었습니다. 아래에서 주문 상세를 확인하세요.
      </Typography>
      {order ? (
        <Paper sx={{ width: "100%", p: 3, mb: 3 }} elevation={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            주문 정보
          </Typography>
          <Stack spacing={1} mb={2}>
            <Typography>
              주문번호: <b>{order.orderNumber ?? order.orderId}</b>
            </Typography>
            <Typography>
              주문일:{" "}
              {order.orderDate
                ? new Date(order.orderDate).toLocaleString()
                : "-"}
            </Typography>
            <Typography>
              상태:{" "}
              {order.orderStatus === "PAID"
                ? "결제완료"
                : order.orderStatus === "PENDING"
                ? "결제대기"
                : order.orderStatus === "FAILED"
                ? "결제실패"
                : order.orderStatus === "CANCELLED"
                ? "취소됨"
                : order.orderStatus === "COMPLETED"
                ? "배송완료"
                : order.orderStatus}
            </Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography fontWeight="bold" mb={1}>
            주문 상품
          </Typography>
          <Stack spacing={2}>
            {order.items?.map((item, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mr: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                    position: "relative",
                  }}
                >
                  <ImageWithFallback
                    src={item.imageUrl ?? "/placeholder.png"}
                    alt={item.itemName ?? ""}
                    width={64}
                    height={64}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight="bold">{item.itemName}</Typography>
                  <Typography color="text.secondary" fontSize={14}>
                    수량: {item.quantity}
                  </Typography>
                </Box>
                <Typography fontWeight="bold">
                  {item.totalPrice?.toLocaleString()}원
                </Typography>
              </Box>
            ))}
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography fontWeight="bold">총 합계</Typography>
            <Typography fontWeight="bold" fontSize={18} color="primary">
              {order.totalPrice?.toLocaleString()}원
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      )}
      <Stack direction="row" spacing={2}>
        <Button href="/" variant="outlined" color="secondary" size="large">
          쇼핑 계속하기
        </Button>
        <Button
          href="/my-page"
          variant="contained"
          color="primary"
          size="large"
        >
          마이페이지에서 주문 내역 확인하기
        </Button>
      </Stack>
    </Box>
  );
}
