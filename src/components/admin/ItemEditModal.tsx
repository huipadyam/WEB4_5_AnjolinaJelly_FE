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
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Item } from "@/types/admin";
import { client } from "@/api/zzirit/client";
import { TypeFetchResponse, BrandFetchResponse } from "@/api/zzirit/models";
import { alertService } from "@/components/admin/AlertSnackbar";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

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
  // 이미지 관련 상태
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isImageUpdated, setIsImageUpdated] = useState<boolean>(false);
  // 선택한 이미지 파일을 저장하는 상태 추가
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

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
        const response = await client.api.findBrandByType({
          typeId: formData.categoryId,
        });
        if (response.success && response.result) {
          setBrands(response.result);
        }
      } catch (error) {
        console.error("브랜드 조회 중 오류 발생:", error);
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
      setImageUrl(item.image || "");
      setIsImageUpdated(false); // 모달이 열릴 때마다 이미지 업데이트 상태 초기화
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

  // 이미지 업로드 함수
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // 선택한 파일을 상태에 저장
      setSelectedImageFile(file);
      // 미리보기를 위한 임시 URL 생성
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setIsImageUpdated(true);
    }
  };

  const handleSubmit = async () => {
    if (!item) return;

    try {
      let updatedImageUrl = imageUrl;

      // 이미지가 변경되었을 경우에만 이미지 업로드
      if (isImageUpdated && selectedImageFile) {
        try {
          // 이미지 업로드 API 호출
          const response = await client.api.uploadImage({
            image: selectedImageFile,
          });

          if (!response.success || !response.result?.imageUrl) {
            throw new Error("이미지 업로드에 실패했습니다.");
          }

          updatedImageUrl = response.result.imageUrl;
        } catch (imageError) {
          console.error("이미지 업로드 중 오류 발생:", imageError);
          alertService.showAlert(
            "이미지 업로드에 실패했습니다. 다시 시도해주세요.",
            "error"
          );
          return;
        }
      }

      // 상품 정보 업데이트
      await client.api.updateItem({
        itemId: formData.id,
        itemUpdateRequest: {
          stockQuantity: formData.stock,
          price: formData.price,
          imageUrl: updatedImageUrl, // 업데이트된 이미지 URL 포함
        },
      });

      const uiData: Item = {
        id: item.id,
        name: item.name,
        stock: formData.stock,
        price: formData.price,
        category: item.category,
        brand: item.brand,
        image: updatedImageUrl,
        itemNumber: item.itemNumber || 0,
        selected: item.selected || false,
      };

      onSave({
        api: {
          itemId: formData.id,
          itemCreateRequest: {
            name: item.name,
            stockQuantity: formData.stock,
            price: formData.price,
            typeId: formData.categoryId,
            brandId: formData.brandId,
          },
        },
        ui: uiData,
      });

      alertService.showAlert(
        `상품 "${item.name}"의 정보가 성공적으로 수정되었습니다.`,
        "success"
      );
    } catch (error) {
      console.error("상품 업데이트 중 오류 발생:", error);
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
          {/* 이미지 업로드 섹션 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              상품 이미지
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}
            >
              {/* 현재 이미지 미리보기 */}
              {imageUrl && (
                <Box
                  sx={{
                    position: "relative",
                    width: 200,
                    height: 200,
                    border: "1px solid #eee",
                    borderRadius: 1,
                    overflow: "hidden",
                    mb: 1,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* 연필 모양 수정 아이콘 */}
                  <IconButton
                    component="label"
                    size="small"
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    <ModeEditIcon fontSize="small" />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </IconButton>
                </Box>
              )}

              {/* 이미지가 없는 경우 업로드 영역 표시 */}
              {!imageUrl && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 200,
                    height: 200,
                    border: "1px dashed #bbb",
                    borderRadius: 1,
                    cursor: "pointer",
                  }}
                  component="label"
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <PhotoCamera
                    sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    이미지 추가
                  </Typography>
                </Box>
              )}

              {isImageUpdated && (
                <Typography variant="caption" color="primary">
                  * 이미지가 변경되었습니다. 저장 버튼을 누르면 반영됩니다.
                </Typography>
              )}
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="상품명"
                name="name"
                value={formData.name}
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                disabled
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
                  label="상품 종류"
                  disabled
                  readOnly
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
                  label="브랜드"
                  disabled
                  readOnly
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
