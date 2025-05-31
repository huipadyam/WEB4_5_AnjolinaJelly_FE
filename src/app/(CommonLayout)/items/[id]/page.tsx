"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ImageWithFallback from "@/components/ImageWithFallback";
import { ItemResponseTimeDealStatusEnum } from "@/api/zzirit/models/ItemResponse";
import { useAddToCartMutation, useItemDetailQuery } from "@/queries/item";

// 가격 3자리 콤마
function formatPrice(price?: number) {
  if (typeof price !== "number") return "-";
  return price.toLocaleString();
}

// 남은 시간 계산
function getTimeLeft(end: Date) {
  const now = new Date();
  now.setHours(now.getHours() - 9);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return "종료됨";
  const h = Math.floor(diff / 1000 / 60 / 60);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return `${h}시간 ${m}분 ${s}초 남음`;
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const { data, isLoading, error } = useItemDetailQuery(id);
  const addToCart = useAddToCartMutation();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  if (isLoading) return <Typography>로딩 중...</Typography>;
  if (error || !data?.result)
    return <Typography>상품을 찾을 수 없습니다.</Typography>;

  const item = data.result;

  // 장바구니 담기 핸들러
  const handleAddToCart = async () => {
    setErrorMsg(null);
    try {
      await addToCart.mutateAsync({ itemId: item.itemId!, quantity: 1 });
      setModalOpen(true);
    } catch (e: unknown) {
      setErrorMsg(
        e instanceof Error
          ? e.message
          : "장바구니 담기에 실패했습니다. 다시 시도해주세요."
      );
      setModalOpen(true);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalOpen(false);
    setErrorMsg(null);
  };

  // 장바구니 페이지로 이동
  const handleGoToCart = () => {
    router.push("/cart");
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 6, p: { xs: 1, sm: 3 } }}>
      {/* 장바구니 추가 완료 모달 */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{errorMsg ? "오류" : "장바구니 추가 완료"}</DialogTitle>
        <DialogContent>
          <Typography>
            {errorMsg
              ? errorMsg
              : "상품이 장바구니에 추가되었습니다. 이동할까요?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            {errorMsg ? "닫기" : "계속 쇼핑하기"}
          </Button>
          {!errorMsg && (
            <Button
              onClick={handleGoToCart}
              color="primary"
              variant="contained"
            >
              장바구니로 이동
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{ p: { xs: 2, sm: 4 }, background: "none", boxShadow: "none" }}
      >
        {/* 좌측: 상품 이미지 */}
        <Box sx={{ minWidth: 320, maxWidth: 400, flex: 1 }}>
          <ImageWithFallback
            src={item.imageUrl || "/images/placeholder.png"}
            alt={item.name || "상품 이미지"}
            width={400}
            height={400}
            style={{
              borderRadius: 12,
              objectFit: "cover",
              width: "100%",
              height: 400,
              background: "#f5f5f5",
            }}
            fallbackKey={String(item.itemId)}
          />
        </Box>

        {/* 우측: 상품 정보 */}
        <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          {/* 타임딜 라벨 및 남은 시간 */}
          {item.itemStatus === ItemResponseTimeDealStatusEnum.TimeDeal && (
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              <Typography color="error" fontWeight={700}>
                {item.endTimeDeal
                  ? getTimeLeft(new Date(item.endTimeDeal))
                  : "-"}
              </Typography>
            </Stack>
          )}

          {/* 상품명 + 카테고리(종류) */}
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <Typography variant="h4" fontWeight={800}>
              {item.name}
            </Typography>
            {item.type && (
              <Chip
                label={item.type}
                size="small"
                sx={{
                  ml: 1,
                  fontWeight: 500,
                  fontSize: 14,
                  background: "#f5f5f5",
                }}
              />
            )}
          </Stack>

          {/* 가격/할인 */}
          <Box>
            {item.itemStatus === ItemResponseTimeDealStatusEnum.TimeDeal ? (
              <Stack direction="column">
                <Stack direction="row" alignItems="baseline" spacing={1.5}>
                  <Stack direction="row" alignItems="baseline" spacing={0.5}>
                    <Typography variant="h5" color="error" fontWeight={700}>
                      {formatPrice(item.discountedPrice)}원
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textDecoration: "line-through" }}
                    >
                      {formatPrice(item.originalPrice)}원
                    </Typography>
                  </Stack>

                  <Chip
                    label={`-${item.discountRatio}%`}
                    color="warning"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: 10,
                    }}
                  />
                </Stack>
                {/* 남은 수량 (타임딜 한정) */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  mb={2}
                >
                  남은 수량: {item.quantity}개
                </Typography>
              </Stack>
            ) : (
              <Typography variant="h5" fontWeight={700}>
                {formatPrice(item.originalPrice)}원
              </Typography>
            )}
          </Box>

          {/* 장바구니/구매 버튼 */}
          <Stack direction="row" spacing={2} mb={3}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ minWidth: 140, fontWeight: 700 }}
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              장바구니 담기
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* 안내 섹션 */}
          <Box>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              배송정보
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              - 평균 2~3일 이내 출고 (주말/공휴일 제외)
              <br />- 도서산간/제주 지역은 추가 배송비가 발생할 수 있습니다.
            </Typography>
            <Typography variant="h6" fontWeight={700} gutterBottom mt={2}>
              교환 및 반품 안내
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              - 상품 수령 후 7일 이내 교환/반품 신청 가능
              <br />- 단순 변심 시 왕복 배송비가 부과될 수 있습니다.
              <br />- 상품 및 포장 상태가 훼손된 경우 교환/반품이 제한될 수
              있습니다.
            </Typography>
            <Typography variant="h6" fontWeight={700} gutterBottom mt={2}>
              환불 안내
            </Typography>
            <Typography variant="body2" color="text.secondary">
              - 환불은 반품 상품 회수 및 상태 확인 후 2~3영업일 이내 처리됩니다.
              <br />- 결제 수단에 따라 환불 소요 기간이 다를 수 있습니다.
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
