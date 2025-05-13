"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  InputAdornment,
  LinearProgress,
  FormHelperText,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ko } from "date-fns/locale";
import { client } from "@/api/zzirit/client";
import { alertService } from "@/components/admin/AlertSnackbar";
import { Item } from "@/types/admin";
import { TimeDealCreateRequest } from "@/api/zzirit/models";

interface TimeDealCreateModalProps {
  open: boolean;
  onClose: () => void;
  selectedItems?: Item[];
}

interface SelectedItem {
  itemId: number;
  itemName: string;
  originalPrice: number;
  quantity: number;
  stockQuantity?: number; // 재고 수량 추가
}

export default function TimeDealCreateModal({
  open,
  onClose,
  selectedItems = [],
}: TimeDealCreateModalProps) {
  const [title, setTitle] = useState("");
  const [discountRate, setDiscountRate] = useState<string>("10");
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SelectedItem[]>([]);

  // 현재 시간 (최소 선택 가능 시간)
  const now = new Date();

  // 폼 유효성 검사
  const [errors, setErrors] = useState({
    title: false,
    discountRate: false,
    startTime: false,
    endTime: false,
    items: false,
  });

  // 선택된 상품들을 초기 아이템 목록으로 변환
  useEffect(() => {
    if (selectedItems.length > 0 && open) {
      // 선택된 상품들을 SelectedItem 형태로 변환
      const initialItems: SelectedItem[] = selectedItems.map((item) => ({
        itemId: item.id,
        itemName: item.name,
        originalPrice: item.price,
        quantity: item.stock, // 재고 수량으로 초기값 설정
        stockQuantity: item.stock, // 재고 수량 저장
      }));

      setItems(initialItems);
    } else {
      // 선택된 상품이 없는 경우, 비어있는 배열로 초기화
      setItems([]);
    }
  }, [selectedItems, open]);

  // 할인율 변경 핸들러
  const handleDiscountRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDiscountRate(value);
  };

  // 아이템 수량 변경
  const handleQuantityChange = (
    itemId: number | undefined,
    quantity: number
  ) => {
    if (!itemId) return;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.itemId === itemId) {
          // 재고 수량 이하로만 설정 가능하도록 제한
          const maxQuantity = item.stockQuantity || 1;
          const validQuantity = Math.min(Math.max(1, quantity), maxQuantity);
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
  };

  // 할인가 계산
  const calculateDiscountPrice = (originalPrice: number | undefined) => {
    if (!originalPrice) return 0;
    const discountRateNumber = parseFloat(discountRate) || 0;
    return Math.round(originalPrice * (1 - discountRateNumber / 100));
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const discountRateNumber = parseFloat(discountRate) || 0;

    const newErrors = {
      title: !title.trim(),
      discountRate: discountRateNumber <= 0 || discountRateNumber > 99,
      startTime: !startTime,
      endTime: !endTime || (!!startTime && !!endTime && endTime <= startTime),
      items: items.length === 0,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  // 타임딜 생성
  const handleCreateTimeDeal = async () => {
    if (!validateForm()) return;

    if (items.length === 0) {
      alertService.showAlert("선택된 상품이 없습니다.", "error");
      return;
    }

    try {
      setLoading(true);

      // 전송할 데이터 구성
      const requestBody = {
        title: title,
        startTime: startTime,
        endTime: endTime,
        discountRatio: parseFloat(discountRate) || 0,
        items: items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      };

      // API 호출
      await client.api.createTimeDeal({
        timeDealCreateRequest: requestBody as TimeDealCreateRequest,
      });

      alertService.showAlert("타임딜이 성공적으로 생성되었습니다.", "success");
      onClose();

      // 폼 초기화
      setTitle("");
      setDiscountRate("10");
      setStartTime(new Date());
      setEndTime(new Date(Date.now() + 24 * 60 * 60 * 1000));
      setItems([]);
    } catch (error) {
      console.error("타임딜 생성 중 오류 발생:", error);
      alertService.showAlert("타임딜 생성 중 오류가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold" component="div">
            타임딜 생성
          </Typography>
        </DialogTitle>
        <Divider />

        {loading && <LinearProgress />}

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              타임딜 기본 정보
            </Typography>

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                label="타임딜 제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                error={errors.title}
                helperText={errors.title ? "제목을 입력해주세요" : ""}
              />

              <TextField
                label="할인율 (%)"
                type="text"
                value={discountRate}
                onChange={handleDiscountRateChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  style: { width: "100%" },
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    width: "100%",
                    textOverflow: "ellipsis",
                  },
                }}
                fullWidth
                error={errors.discountRate}
                helperText={
                  errors.discountRate ? "1-99 사이의 할인율을 입력해주세요" : ""
                }
              />

              <DateTimePicker
                label="시작 시간"
                value={startTime}
                onChange={(date: Date | null) => setStartTime(date)}
                minDateTime={now} // 현재 시간 이후만 선택 가능
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: errors.startTime,
                    helperText: errors.startTime
                      ? "시작 시간을 선택해주세요"
                      : "",
                  },
                }}
              />

              <DateTimePicker
                label="종료 시간"
                value={endTime}
                onChange={(date: Date | null) => setEndTime(date)}
                minDateTime={startTime || now} // 시작 시간 또는 현재 시간 이후만 선택 가능
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: errors.endTime,
                    helperText: errors.endTime
                      ? "종료 시간은 시작 시간 이후여야 합니다"
                      : "",
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              타임딜 상품 목록
            </Typography>

            {errors.items && (
              <FormHelperText error>선택된 상품이 없습니다</FormHelperText>
            )}

            <TableContainer
              sx={{
                maxHeight: 400,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>상품명</TableCell>
                    <TableCell align="right">원가</TableCell>
                    <TableCell align="right">할인가</TableCell>
                    <TableCell align="center">수량</TableCell>
                    <TableCell align="center">재고</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        선택한 상품이 없습니다. 상품을 선택한 후 다시
                        시도해주세요.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, index) => (
                      <TableRow key={item.itemId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell align="right">
                          ₩{formatPrice(item.originalPrice)}
                        </TableCell>
                        <TableCell align="right">
                          ₩
                          {formatPrice(
                            calculateDiscountPrice(item.originalPrice)
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            size="small"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.itemId,
                                parseInt(e.target.value)
                              )
                            }
                            inputProps={{
                              min: 1,
                              max: item.stockQuantity || 1,
                              style: { textAlign: "center", width: "60px" },
                            }}
                            variant="outlined"
                            helperText={`최대: ${item.stockQuantity || 1}`}
                            FormHelperTextProps={{
                              sx: { m: 0, fontSize: "0.7rem" },
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {item.stockQuantity || 0}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit" variant="outlined">
            취소
          </Button>
          <Button
            onClick={handleCreateTimeDeal}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            타임딜 생성
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
