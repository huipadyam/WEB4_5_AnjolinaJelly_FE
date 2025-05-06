"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  List,
  ListItem,
  Chip,
} from "@mui/material";
import { Item } from "@/types/admin";
import { useTheme } from "@mui/material";

interface ItemDeleteModalProps {
  open: boolean;
  selectedItems: Item[];
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function ItemDeleteModal({
  open,
  selectedItems,
  onClose,
  onConfirm,
}: ItemDeleteModalProps) {
  const theme = useTheme();

  // 삭제할 상품이 없는 경우
  if (selectedItems.length === 0) {
    return null;
  }

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold" component="div">
          상품 삭제 확인
        </Typography>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <Typography variant="body1" gutterBottom>
          선택한 {selectedItems.length}개의 상품을 삭제하시겠습니까?
        </Typography>
        <Typography variant="body2" color="error" gutterBottom>
          이 작업은 되돌릴 수 없습니다.
        </Typography>

        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            삭제할 상품 목록
          </Typography>
          <List
            sx={{
              maxHeight: 200,
              overflow: "auto",
              bgcolor: "background.paper",
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              mt: 1,
            }}
          >
            {selectedItems.map((item) => (
              <ListItem key={item.id} divider>
                <Box sx={{ width: "100%" }}>
                  <Typography variant="body1">{item.name}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(44, 62, 80, 0.08)",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                    >
                      {item.brand}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="primary"
                      component="span"
                    >
                      ₩{formatPrice(item.price)}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          취소
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{ ml: 1 }}
        >
          삭제하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
