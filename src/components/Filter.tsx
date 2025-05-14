"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { client } from "@/api/zzirit/client";
import type {
  TypeFetchResponse,
  BrandFetchResponse,
} from "@/api/zzirit/models";

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 상태 관리
  const [types, setTypes] = useState<TypeFetchResponse[]>([]);
  const [brands, setBrands] = useState<BrandFetchResponse[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);

  // 상품 종류 불러오기
  useEffect(() => {
    const fetchTypes = async () => {
      const res = await client.api.findType();
      setTypes(res.result ?? []);
    };
    fetchTypes();
  }, []);

  // 선택된 타입이 바뀌면 해당 브랜드 불러오기 (여러 타입 동시 지원)
  useEffect(() => {
    if (selectedTypes.length === 0) {
      setBrands([]);
      setSelectedBrands([]);
      return;
    }
    const fetchBrands = async () => {
      // 여러 타입을 지원하므로, 각 타입별 브랜드를 합침(중복 제거)
      const brandMap = new Map<number, BrandFetchResponse>();
      for (const typeId of selectedTypes) {
        const res = await client.api.findBrandByType({ typeId });
        (res.result ?? []).forEach((b) => {
          if (b.brandId !== undefined) brandMap.set(b.brandId, b);
        });
      }
      setBrands(Array.from(brandMap.values()));
      // 선택된 브랜드 중, 현재 브랜드 목록에 없는 것은 해제
      setSelectedBrands((prev) => prev.filter((id) => brandMap.has(id)));
    };
    fetchBrands();
  }, [selectedTypes]);

  // 체크박스 핸들러
  const handleTypeChange = (typeId: number) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };
  const handleBrandChange = (brandId: number) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  // 필터 적용
  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedTypes.length > 0) params.set("types", selectedTypes.join(","));
    else params.delete("types");
    if (selectedBrands.length > 0)
      params.set("brands", selectedBrands.join(","));
    else params.delete("brands");
    router.replace(`?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: "10px",
        display: "flex",
        width: 200,
        flexDirection: "column",
        gap: 3,
        my: 2,
        bgcolor: "background.paper",
        border: "1px solid #E0E0E0",
        p: 2,
        borderRadius: 1,
        zIndex: 1,
      }}
    >
      {/* 상품 종류 체크박스 */}
      <FormControl component="fieldset" variant="standard">
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          상품 종류
        </Typography>
        <FormGroup>
          {types.map((type) => (
            <FormControlLabel
              key={type.typeId}
              control={
                <Checkbox
                  checked={selectedTypes.includes(type.typeId ?? -1)}
                  onChange={() => handleTypeChange(type.typeId ?? -1)}
                  disabled={type.typeId === undefined}
                />
              }
              label={type.name}
            />
          ))}
        </FormGroup>
        {/* 선택된 종류 Chip */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 1,
            flexWrap: "wrap",
            gap: 0.25,
            "& .MuiChip-root": {
              mb: 0.5,
              alignSelf: "flex-start",
            },
          }}
        >
          {types
            .filter((t) => selectedTypes.includes(t.typeId ?? -1))
            .map((t) => (
              <Chip
                key={t.typeId}
                label={t.name}
                onDelete={() => handleTypeChange(t.typeId ?? -1)}
                size="small"
                color="primary"
                sx={{ ml: "0 !important" }}
              />
            ))}
        </Stack>
      </FormControl>

      {/* 브랜드 체크박스 */}
      <FormControl
        component="fieldset"
        variant="standard"
        disabled={brands.length === 0}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          브랜드
        </Typography>
        {brands.length > 0 && (
          <FormGroup>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand.brandId}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand.brandId ?? -1)}
                    onChange={() => handleBrandChange(brand.brandId ?? -1)}
                    disabled={brand.brandId === undefined}
                  />
                }
                label={brand.name}
              />
            ))}
          </FormGroup>
        )}
        {brands.length === 0 && (
          <Typography variant="subtitle2" color="text.secondary">
            선택된 상품 종류가 없습니다.
          </Typography>
        )}
        {/* 선태된 브랜드 Chip */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 1,
            flexWrap: "wrap",
            gap: 0.25,
            "& .MuiChip-root": {
              mb: 0.5,
              alignSelf: "flex-start",
            },
          }}
        >
          {brands
            .filter((b) => selectedBrands.includes(b.brandId ?? -1))
            .map((b) => (
              <Chip
                key={b.brandId}
                label={b.name}
                onDelete={() => handleBrandChange(b.brandId ?? -1)}
                size="small"
                color="primary"
                sx={{ ml: "0 !important" }}
              />
            ))}
        </Stack>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleApply}
        sx={{ alignSelf: "flex-start" }}
      >
        적용
      </Button>
    </Box>
  );
}
