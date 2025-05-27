"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCartQuery } from "@/queries/cart";
import { useInitOrderMutation } from "@/queries/order";
import { useGetMyPageInfo } from "@/queries/member";
import ImageWithFallback from "@/components/ImageWithFallback";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { ANONYMOUS } from "@tosspayments/tosspayments-sdk";

const clientKey = "test_ck_AQ92ymxN34L55wj4Wzgg3ajRKXvd";

export default function OrderPage() {
  const { data: myPageInfo } = useGetMyPageInfo();
  const router = useRouter();
  const [request, setRequest] = useState("");
  const [open, setOpen] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // 장바구니 데이터 가져오기
  const { data: cartItems = [] } = useCartQuery();

  // 결제(주문 생성) mutation
  const initOrderMutation = useInitOrderMutation();

  // 총 합계 계산
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  // 결제하기 버튼 클릭
  const handleOrder = async () => {
    try {
      const res = await initOrderMutation.mutateAsync({
        orderItems: cartItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          itemName: item.name,
        })),
        totalAmount: totalPrice,
        shippingRequest: request,
        address: myPageInfo?.memberAddress ?? "",
        addressDetail: myPageInfo?.memberAddressDetail ?? "",
      });

      console.log(res.result);
      const orderId = res.result?.orderId;
      if (!orderId) return;
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const payment = tossPayments.payment({ customerKey: ANONYMOUS });

        await payment.requestPayment({
          method: "CARD",
          amount: {
            value: res?.result?.amount ?? 0,
            currency: "KRW",
          },
          orderId: orderId,
          orderName: "주문 결제",
          customerName: myPageInfo?.memberName ?? "",
          successUrl: `${process.env.NEXT_PUBLIC_CLIENT_URL}/payment/success`,
          failUrl: `${process.env.NEXT_PUBLIC_CLIENT_URL}/payment/fail?orderId=${orderId}`,
        });
      } catch (e) {
        console.error(e);
      }
    } catch {
      setPaymentError("주문 생성에 실패했습니다.");
    }
  };

  // 다이얼로그 버튼 핸들러
  const handleGoMyPage = () => {
    router.push("/my-page");
  };
  const handleGoHome = () => {
    router.push("/");
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
      {/* 배송정보 (실제 서비스에서는 회원정보 API로 대체) */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        배송정보
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography fontWeight="bold">{myPageInfo?.memberName}</Typography>
        <Typography color="text.secondary" fontSize={15}>
          {myPageInfo?.memberAddress}
        </Typography>
        <Typography color="text.secondary" fontSize={15}>
          {myPageInfo?.memberAddressDetail}
        </Typography>
        <TextField
          label="배송시 요청사항"
          fullWidth
          size="small"
          value={request}
          color="secondary"
          onChange={(e) => setRequest(e.target.value)}
          sx={{ mt: 2 }}
          placeholder="예: 문 앞에 놓아주세요"
        />
      </Paper>

      {/* 주문정보 */}
      <Typography variant="h6" fontWeight="bold" mb={1}>
        주문정보
      </Typography>
      <Paper sx={{ mb: 2 }}>
        {cartItems.map((item) => (
          <Box
            key={item.itemId}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #eee",
              ":last-child": { borderBottom: 0 },
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
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.type} | {item.brand}
              </Typography>
            </Box>
            <Stack alignItems="flex-end">
              <Typography>수량: {item.quantity ?? 1}</Typography>
              <Typography fontWeight="bold">
                {(item.price ?? 0 * (item.quantity ?? 1)).toLocaleString()}원
              </Typography>
            </Stack>
          </Box>
        ))}
      </Paper>
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
        onClick={handleOrder}
        sx={{ mb: 2 }}
      >
        결제하기
      </Button>
      {paymentError && (
        <Typography color="error" mb={2}>
          {paymentError}
        </Typography>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>주문이 접수되었습니다.</DialogTitle>
        <DialogContent>
          <Typography>
            마이페이지에서 주문 내역을 확인할 수 있습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGoMyPage} variant="contained" color="primary">
            마이 페이지로 가기
          </Button>
          <Button onClick={handleGoHome} color="secondary" variant="outlined">
            쇼핑 계속하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
