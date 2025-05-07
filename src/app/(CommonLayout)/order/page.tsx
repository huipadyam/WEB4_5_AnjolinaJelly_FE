"use client";

import React, { useEffect, useState } from "react";
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
import memberData from "@/api/zzirit/mocks/member.json";
import itemsData from "@/api/zzirit/mocks/items.json";
import { Member, MemberRoleEnum } from "@/api/zzirit/models/Member";
import { ItemResponse } from "@/api/zzirit";

const LOCAL_KEY = "cart_items";

export default function OrderPage() {
  const router = useRouter();
  const [request, setRequest] = useState("");
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<Record<number, number>>({});

  // member mock 데이터
  const member: Member = {
    ...memberData,
    createdAt: memberData.createdAt
      ? new Date(memberData.createdAt)
      : undefined,
    updatedAt: memberData.updatedAt
      ? new Date(memberData.updatedAt)
      : undefined,
    role: memberData.role as MemberRoleEnum,
  };
  // 상품 mock 데이터 (2개만)
  const items = itemsData.result.content.slice(
    0,
    2
  ) as unknown as ItemResponse[];

  // 로컬스토리지에서 count 정보 불러오기
  const getLocalCounts = (): Record<number, number> => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}");
    } catch {
      return {};
    }
  };

  // 주문 페이지 진입 시 장바구니와 동기화
  useEffect(() => {
    const localCounts = getLocalCounts();
    // 주문 상품만 필터링
    const validCounts: Record<number, number> = {};

    items.forEach((item) => {
      if (item.itemId !== undefined) {
        validCounts[item.itemId] = localCounts[item.itemId] ?? 1;
      }
    });

    setCounts(validCounts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 총 합계 계산
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * (counts[item.itemId ?? 0] ?? 1),
    0
  );

  // 결제하기 버튼 클릭
  const handleOrder = () => {
    // TODO: 주문 생성 API 호출 필요
    // 결제 시 장바구니에서 해당 상품 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_KEY);
    }
    setOpen(true);
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
      {/* 배송정보 */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        배송정보
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography fontWeight="bold">{member.memberName}</Typography>
        <Typography color="text.secondary" fontSize={15}>
          {member.memberAddress}
        </Typography>
        <Typography color="text.secondary" fontSize={15}>
          {member.memberAddressDetail}
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
        {items.map((item) => (
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
            {/* 상품 정보 */}
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.type} | {item.brand}
              </Typography>
            </Box>
            {/* 수량/가격 */}
            <Stack alignItems="flex-end">
              <Typography>수량: {counts[item.itemId ?? 0] ?? 1}</Typography>
              <Typography fontWeight="bold">
                {(
                  (item.price ?? 0) * (counts[item.itemId ?? 0] ?? 1)
                ).toLocaleString()}
                원
              </Typography>
            </Stack>
          </Box>
        ))}
      </Paper>
      <Divider />
      {/* 총 합계 및 결제 버튼 */}
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

      {/* 결제 완료 다이얼로그 */}
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
