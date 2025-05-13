"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Item } from "@/types/admin";
import { client } from "@/api/zzirit/client";
import { TypeFetchResponse, BrandFetchResponse } from "@/api/zzirit/models";
import { alertService } from "@/components/admin/AlertSnackbar";

interface ItemEditModalProps {
  open: boolean;
  item: Item | null;
  onClose: () => void;
  onSave: (data: ItemEditData) => void;
}

// onSave에 전달되는 데이터 구조 정의
interface ItemEditData {
  api: {
    itemId: number;
    itemCreateRequest: {
      name: string;
      stockQuantity: number;
      price: number;
      typeId: number;
      brandId: number;
    };
  };
  ui: Item;
}

export default function ItemEditModal({
  open,
  item,
  onClose,
  onSave,
}: ItemEditModalProps) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    stock: 0,
    price: 0,
    categoryId: 0,
    brandId: 0,
  });
  const [categories, setCategories] = useState<TypeFetchResponse[]>([]);
  const [brands, setBrands] = useState<BrandFetchResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // 상품 종류 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await client.api.findType();
        if (response.success && response.result) {
          setCategories(response.result);
        }
      } catch (error) {
        console.error("상품 종류 조회 중 오류 발생:", error);
      }
    };

    fetchCategories();
  }, []);

  // 선택된 상품 종류에 맞는 브랜드 목록 가져오기
  useEffect(() => {
    const fetchBrands = async () => {
      if (formData.categoryId <= 0) return;

      try {
        setLoading(true);
        const response = await client.api.findBrandByType({
          typeId: formData.categoryId,
        });
        if (response.success && response.result) {
          setBrands(response.result);
        }
      } catch (error) {
        console.error("브랜드 조회 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [formData.categoryId]);

  // 상품 정보가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    if (item && categories.length > 0) {
      // 카테고리 이름으로부터 ID 찾기
      const categoryId =
        categories.find((cat) => cat.name === item.category)?.typeId || 0;

      setFormData({
        id: item.id,
        name: item.name,
        stock: item.stock,
        price: item.price,
        categoryId,
        brandId: 0, // 카테고리 선택에 따라 브랜드 목록이 변경되므로 초기값은 0
      });
    }
  }, [item, categories]);

  // 브랜드 목록이 로드되면 아이템의 브랜드를 선택
  useEffect(() => {
    if (item && brands.length > 0) {
      const brandId =
        brands.find((brand) => brand.name === item.brand)?.brandId || 0;

      if (brandId > 0) {
        setFormData((prev) => ({
          ...prev,
          brandId,
        }));
      }
    }
  }, [item, brands]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | SelectChangeEvent<unknown>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const categoryName =
      categories.find((cat) => cat.typeId === formData.categoryId)?.name || "";
    const brandName =
      brands.find((brand) => brand.brandId === formData.brandId)?.name || "";

    // API에 전송할 데이터 준비
    const apiData = {
      itemId: formData.id,
      itemCreateRequest: {
        name: formData.name,
        stockQuantity: formData.stock,
        price: formData.price,
        typeId: formData.categoryId,
        brandId: formData.brandId,
      },
    };

    try {
      await client.api.updateItem({
        itemId: formData.id,
        itemUpdateRequest: {
          stockQuantity: formData.stock,
          price: formData.price,
        },
      });

      // item이 null이 아님을 확인했으므로 안전하게 id를 사용할 수 있음
      if (!item) return;

      const uiData: Item = {
        id: item.id,
        name: formData.name,
        stock: formData.stock,
        price: formData.price,
        category: categoryName,
        brand: brandName,
        image: item.image || "",
        itemNumber: item.itemNumber || 0,
        selected: item.selected || false,
      };

      onSave({ api: apiData, ui: uiData });

      // 수정 성공 알림 표시
      alertService.showAlert(
        `상품 "${formData.name}"이(가) 성공적으로 수정되었습니다.`,
        "success"
      );
    } catch (error) {
      console.error("상품 업데이트 중 오류 발생:", error);
      // 오류 처리 로직 추가
      alertService.showAlert("상품 수정 중 오류가 발생했습니다.", "error");
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold" component="div">
          상품 정보 수정
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="상품명"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="재고 수량"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                slotProps={{
                  input: {
                    inputProps: { min: 0 },
                  },
                }}
              />
              <TextField
                fullWidth
                label="가격"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                slotProps={{
                  input: {
                    inputProps: { min: 0 },
                    startAdornment: <Typography sx={{ mr: 1 }}>₩</Typography>,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>상품 종류</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  label="상품 종류"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.typeId} value={category.typeId}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>브랜드</InputLabel>
                <Select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  label="브랜드"
                  disabled={
                    loading || formData.categoryId === 0 || brands.length === 0
                  }
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand.brandId} value={brand.brandId}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  상품 ID: {formData.id}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
