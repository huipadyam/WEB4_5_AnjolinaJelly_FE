"use client";

import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function PaymentSuccessError() {
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
          결제 처리 중 오류가 발생했습니다
        </Typography>
        <Typography color="text.secondary" mb={3}>
          결제는 성공적으로 이루어졌지만, 주문 정보를 불러오는 과정에서 문제가
          발생했습니다.
          <br />
          마이페이지에서 주문 내역을 확인해주세요.
        </Typography>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button href="/" variant="outlined" color="secondary" size="large">
          홈으로 가기
        </Button>
        <Button
          href="/my-page"
          variant="contained"
          color="primary"
          size="large"
        >
          마이페이지에서 확인하기
        </Button>
      </Stack>
    </Box>
  );
}
