import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { client } from "@/api/zzirit/client";
import { alertService } from "./AlertSnackbar";
import { TypeResponse, BrandResponse } from "@/api/zzirit/models";

interface ItemAddModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ItemAddModal({
  open,
  onClose,
  onSuccess,
}: ItemAddModalProps) {
  // 상품 정보 상태
  const [name, setName] = useState("");
  const [stockQuantity, setStockQuantity] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [typeId, setTypeId] = useState<number | "">("");
  const [brandId, setBrandId] = useState<number | "">("");

  // 이미지 관련 상태
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // 타입 및 브랜드 목록
  const [types, setTypes] = useState<TypeResponse[]>([]);
  const [brands, setBrands] = useState<BrandResponse[]>([]);

  // 유효성 검사 상태
  const [errors, setErrors] = useState({
    name: false,
    stockQuantity: false,
    price: false,
    typeId: false,
    brandId: false,
  });

  // 타입 목록 로드
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await client.findType();
        if (response.result) {
          setTypes(response.result);
        }
      } catch (error) {
        console.error("상품 종류 조회 실패:", error);
        alertService.showAlert("상품 종류를 불러오는데 실패했습니다.", "error");
      }
    };

    fetchTypes();
  }, []);

  // 타입 선택 시 해당 브랜드 목록 로드
  useEffect(() => {
    const fetchBrands = async () => {
      if (typeId === "") return;

      try {
        const response = await client.findBrandByType({
          typeId: typeId as number,
        });
        if (response.result) {
          setBrands(response.result);
        } else {
          setBrands([]);
        }
      } catch (error) {
        console.error("브랜드 조회 실패:", error);
        alertService.showAlert("브랜드를 불러오는데 실패했습니다.", "error");
        setBrands([]);
      }
    };

    fetchBrands();
  }, [typeId]);

  // 모달 리셋 함수
  const resetForm = () => {
    setName("");
    setStockQuantity("");
    setPrice("");
    setTypeId("");
    setBrandId("");
    setImages([]);
    setImagePreviewUrls([]);
    setErrors({
      name: false,
      stockQuantity: false,
      price: false,
      typeId: false,
      brandId: false,
    });
  };

  // 이미지 처리 함수
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);

      // 최대 3개까지 이미지 추가 가능
      const newImages = [...images];
      const newPreviewUrls = [...imagePreviewUrls];

      filesArray.forEach((file) => {
        if (newImages.length < 3) {
          newImages.push(file);
          newPreviewUrls.push(URL.createObjectURL(file));
        }
      });

      setImages(newImages);
      setImagePreviewUrls(newPreviewUrls);
    }
  };

  // 이미지 삭제 함수
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    const newPreviewUrls = [...imagePreviewUrls];

    URL.revokeObjectURL(newPreviewUrls[index]);
    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  // 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {
      name: name.trim() === "",
      stockQuantity:
        stockQuantity === "" ||
        (typeof stockQuantity === "number" && stockQuantity < 0),
      price: price === "" || (typeof price === "number" && price < 0),
      typeId: typeId === "",
      brandId: brandId === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  // 상품 등록 함수
  const handleSubmit = async () => {
    if (!validateForm()) {
      alertService.showAlert("모든 필드를 올바르게 입력해주세요.", "error");
      return;
    }

    try {
      // 상품 등록
      const response = await client.addItem({
        itemCreateRequest: {
          name,
          stockQuantity: stockQuantity as number,
          price: price as number,
          typeId: typeId as number,
          brandId: brandId as number,
        },
      });

      // 등록된 상품 ID 확인 (Mock API에서는 상품 ID를 응답에 추가해야 함)
      // 실제 API에서는 응답에서 상품 ID를 가져와야 합니다
      let itemId: number | undefined;

      if (response.result && typeof response.result === "object") {
        const { itemId: responseItemId } = response.result as {
          itemId?: number;
        };
        if (responseItemId) {
          itemId = responseItemId;
        }
      }

      // 이미지 업로드 (등록된 이미지가 있을 경우)
      if (images.length > 0 && itemId !== undefined) {
        for (let i = 0; i < images.length; i++) {
          try {
            // API에 맞게 이미지 파일을 전달
            await client.uploadImage({
              itemId,
              uploadImageRequest: {
                image: images[i],
              },
            });
          } catch (imageError) {
            console.error(`이미지 ${i + 1} 업로드 실패:`, imageError);
            // 이미지 업로드 실패해도 계속 진행
          }
        }
      } else if (images.length > 0 && itemId === undefined) {
        console.warn("상품 ID를 받지 못해 이미지 업로드를 건너뜁니다.");
        alertService.showAlert(
          "상품은 등록되었으나 이미지 업로드에 실패했습니다.",
          "warning"
        );
      }

      alertService.showAlert("상품이 성공적으로 등록되었습니다.", "success");
      resetForm();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("상품 등록 실패:", error);
      alertService.showAlert("상품 등록에 실패했습니다.", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: "bold" }}>
        상품 등록
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* 이미지 업로드 섹션 */}
          <Box>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              상품 이미지 (최대 3개)
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, my: 2 }}>
              {imagePreviewUrls.map((url, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: 150,
                    height: 150,
                    border: "1px solid #eee",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {images.length < 3 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 150,
                    height: 150,
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
            </Box>
            <FormHelperText>
              이미지는 최대 3개까지 업로드 가능합니다.
            </FormHelperText>
          </Box>

          {/* 상품 정보 입력 필드 */}
          <Box>
            <TextField
              fullWidth
              label="상품명"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              helperText={errors.name ? "상품명을 입력해주세요" : ""}
              sx={{ mb: 3 }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="재고수량"
                variant="outlined"
                type="number"
                value={stockQuantity}
                onChange={(e) =>
                  setStockQuantity(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                error={errors.stockQuantity}
                helperText={
                  errors.stockQuantity ? "올바른 재고수량을 입력해주세요" : ""
                }
                InputProps={{
                  inputProps: { min: 0 },
                }}
                sx={{ mb: 3 }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="판매가격"
                variant="outlined"
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
                error={errors.price}
                helperText={errors.price ? "올바른 가격을 입력해주세요" : ""}
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: (
                    <InputAdornment position="end">원</InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth error={errors.typeId} sx={{ mb: 3 }}>
                <InputLabel id="type-select-label">상품 종류</InputLabel>
                <Select
                  labelId="type-select-label"
                  value={typeId}
                  label="상품 종류"
                  onChange={(e) => {
                    setTypeId(e.target.value as number);
                    setBrandId(""); // 타입 변경시 브랜드 초기화
                  }}
                >
                  {types.map((type) => (
                    <MenuItem key={type.typeId} value={type.typeId}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.typeId && (
                  <FormHelperText>상품 종류를 선택해주세요</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Box sx={{ flex: 1 }}>
              <FormControl
                fullWidth
                error={errors.brandId}
                sx={{ mb: 3 }}
                disabled={typeId === ""}
              >
                <InputLabel id="brand-select-label">브랜드</InputLabel>
                <Select
                  labelId="brand-select-label"
                  value={brandId}
                  label="브랜드"
                  onChange={(e) => setBrandId(e.target.value as number)}
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand.brandId} value={brand.brandId}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.brandId && (
                  <FormHelperText>브랜드를 선택해주세요</FormHelperText>
                )}
                {typeId === "" && (
                  <FormHelperText>먼저 상품 종류를 선택해주세요</FormHelperText>
                )}
              </FormControl>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          취소
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          등록하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
