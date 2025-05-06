"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        관리자 페이지
      </Typography>

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => router.push("/admin/products")}
        >
          상품 관리
        </Button>

        <Button
          variant="contained"
          onClick={() => router.push("/admin/orders")}
        >
          주문 관리
        </Button>

        <Button variant="contained" onClick={() => router.push("/admin/users")}>
          회원 관리
        </Button>
      </Stack>
    </Box>
  );
}
