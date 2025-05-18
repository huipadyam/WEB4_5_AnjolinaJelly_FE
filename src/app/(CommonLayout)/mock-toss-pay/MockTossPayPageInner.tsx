"use client";

import { useSearchParams } from "next/navigation";
import { Box, Typography, Button, Paper } from "@mui/material";

export default function MockTossPayPageInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  // 결제 완료 버튼 클릭 시 부모 창에 메시지 전송
  const handlePaymentSuccess = () => {
    window.opener?.postMessage(
      {
        paymentSuccess: true,
        paymentKey: "MOCK_PAYMENT_KEY", // 실제 결제라면 결제키를 전달
        orderId,
        amount,
      },
      window.location.origin // 보안상 origin 명시
    );
    window.close(); // 결제창 닫기
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" mb={2}>
          모의 결제창
        </Typography>
        <Typography mb={1}>주문번호: {orderId}</Typography>
        <Typography mb={3}>결제금액: {amount}원</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePaymentSuccess}
          fullWidth
        >
          결제 완료
        </Button>
      </Paper>
    </Box>
  );
}
