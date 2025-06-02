"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
} from "@mui/material";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useGetMyPageInfo } from "@/queries/member";
import {
  useCancelOrderMutation,
  useGetMyOrdersInfinite,
} from "@/queries/order";
import { client } from "@/api/zzirit/client";

// 카카오 주소 API 타입 선언 (회원가입 참고)
interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
      }) => { open: () => void };
    };
  }
}

export default function MyPage() {
  // 내 정보 쿼리
  const { data: memberInfo, isLoading, isError } = useGetMyPageInfo();

  // 주소 상태 (수정 다이얼로그용)
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editAddress, setEditAddress] = useState("");
  const [editDetailAddress, setEditDetailAddress] = useState("");

  const cancelOrderMutation = useCancelOrderMutation();

  // 쿼리 데이터가 바뀔 때 주소 상태 동기화
  React.useEffect(() => {
    setAddress(memberInfo?.memberAddress || "");
    setDetailAddress(memberInfo?.memberAddressDetail || "");
  }, [memberInfo?.memberAddress, memberInfo?.memberAddressDetail]);

  // 주소 검색 팝업
  const handleOpenAddressPopup = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert(
        "주소 검색 서비스를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요."
      );
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data: DaumPostcodeData) {
        let fullAddress = data.address;
        let extraAddress = "";
        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== ""
                ? ", " + data.buildingName
                : data.buildingName;
          }
          if (extraAddress !== "") {
            fullAddress += ` (${extraAddress})`;
          }
        }
        setEditAddress(fullAddress);
      },
    }).open();
  };

  // 주소 수정 다이얼로그 열기
  const handleEditOpen = () => {
    setEditAddress(address);
    setEditDetailAddress(detailAddress);
    setEditOpen(true);
  };
  // 주소 수정 저장
  const handleEditSave = () => {
    client.auth.updateAddress({
      addressUpdateRequest: {
        memberAddress: editAddress,
        memberAddressDetail: editDetailAddress,
      },
    });
    setAddress(editAddress);
    setDetailAddress(editDetailAddress);
    setEditOpen(false);
  };

  // 주문 취소
  const handleOrderCancel = (orderId: number) => {
    cancelOrderMutation.mutate(orderId, {
      onError: (error: unknown) => {
        console.error("주문 취소 실패:", error, "주문 아이디:", orderId);
      },
    });
  };

  // 무한 스크롤 주문 내역 쿼리
  const {
    data: orderPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: ordersIsLoading,
    isError: ordersIsError,
  } = useGetMyOrdersInfinite();

  // 마지막 주문 카드 ref
  const observer = useRef<IntersectionObserver | null>(null);
  const lastOrderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        p: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* 내 정보 */}
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" fontWeight="bold">
            내 정보
          </Typography>
          <Button
            size="small"
            variant="text"
            color="secondary"
            onClick={handleEditOpen}
            sx={{ px: 0, py: 0.5 }}
          >
            수정
          </Button>
        </Box>
        <Paper sx={{ p: 3, pt: 2, mb: 2 }}>
          {isLoading ? (
            <Typography color="text.secondary">불러오는 중...</Typography>
          ) : isError ? (
            <Typography color="error">
              내 정보를 불러오지 못했습니다.
            </Typography>
          ) : (
            <Stack spacing={1}>
              <Typography>
                <b>이름</b>: {memberInfo?.memberName || "-"}
              </Typography>
              <Typography>
                <b>주소</b>: {address}
              </Typography>
              <Typography>
                <b>상세주소</b>: {detailAddress}
              </Typography>
            </Stack>
          )}
        </Paper>
      </Box>

      {/* 주소 수정 다이얼로그 */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>주소 수정</DialogTitle>
        <DialogContent sx={{ minWidth: 320 }}>
          <Stack spacing={2} mt={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="주소"
                value={editAddress}
                InputProps={{ readOnly: true }}
                fullWidth
                color="secondary"
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenAddressPopup}
              >
                검색
              </Button>
            </Stack>
            <TextField
              label="상세주소"
              value={editDetailAddress}
              onChange={(e) => setEditDetailAddress(e.target.value)}
              fullWidth
              color="secondary"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            취소
          </Button>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 주문 내역 */}
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          주문 내역
        </Typography>
        <Stack spacing={3}>
          {ordersIsLoading && (
            <Typography color="text.secondary">불러오는 중...</Typography>
          )}
          {ordersIsError && (
            <Typography color="error">
              주문 내역을 불러오지 못했습니다.
            </Typography>
          )}
          {orderPages &&
            orderPages.pages.flatMap((page) => page.content ?? []).length ===
              0 && (
              <Typography color="text.secondary">
                주문 내역이 없습니다.
              </Typography>
            )}
          {orderPages &&
            orderPages.pages
              .flatMap((page) => page.content ?? [])
              .map((order, idx, arr) => {
                const isLast = idx === arr.length - 1;
                return (
                  <Paper
                    key={order.orderId}
                    sx={{ p: 2 }}
                    ref={isLast ? lastOrderRef : undefined}
                  >
                    {/* 주문 헤더 */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight="bold">
                        {order.orderDate &&
                          new Date(order.orderDate).toLocaleDateString()}{" "}
                        {"|"} 주문번호: {order.orderNumber}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          color={
                            order.orderStatus === "PAID"
                              ? "success"
                              : order.orderStatus === "COMPLETED"
                              ? "info"
                              : order.orderStatus === "CANCELLED"
                              ? "error"
                              : "secondary"
                          }
                          fontWeight="bold"
                        >
                          {order.orderStatus === "PAID"
                            ? "결제완료"
                            : order.orderStatus === "COMPLETED"
                            ? "구매확정"
                            : order.orderStatus === "CANCELLED"
                            ? "취소됨"
                            : order.orderStatus === "PENDING"
                            ? "결제대기"
                            : order.orderStatus === "FAILED"
                            ? "결제실패"
                            : order.orderStatus}
                        </Typography>

                        {order.orderStatus === "PAID" && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleOrderCancel(order.orderId!)}
                          >
                            주문취소
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    {/* 주문 상품 목록 */}
                    <Stack spacing={1}>
                      {order.items?.map((item, idx) => (
                        <Stack
                          key={idx}
                          direction="row"
                          alignItems="center"
                          spacing={2}
                        >
                          <ImageWithFallback
                            src={item.imageUrl ?? "default-item.png"}
                            alt={item.itemName ?? ""}
                            width={56}
                            height={56}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight="bold">
                              {item.itemName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              수량: {item.quantity}
                            </Typography>
                          </Box>
                          <Typography fontWeight="bold">
                            {item.totalPrice?.toLocaleString()}원
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Divider sx={{ my: 1 }} />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight="bold">총 주문금액</Typography>
                      <Typography fontWeight="bold" fontSize={17}>
                        {order.totalPrice?.toLocaleString()}원
                      </Typography>
                    </Stack>
                  </Paper>
                );
              })}
          {isFetchingNextPage && (
            <Typography color="text.secondary">더 불러오는 중...</Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
