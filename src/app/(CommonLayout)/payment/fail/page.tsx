"use client";

import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useFailPayment } from "@/queries/order";
import { useSearchParams } from "next/navigation";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") as string;

  const {} = useFailPayment(orderId);
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
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          p: 4,
          mb: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom color="error">
          결제가 실패했습니다
        </Typography>
        <Typography color="text.secondary" mb={3}>
          결제 처리 중 문제가 발생했습니다.
          <br />
          다시 시도해주시거나 다른 결제 수단을 이용해주세요.
        </Typography>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button href="/" variant="outlined" color="secondary" size="large">
          홈으로 가기
        </Button>
        <Button href="/order" variant="contained" color="primary" size="large">
          다시 시도하기
        </Button>
      </Stack>
    </Box>
  );
}
