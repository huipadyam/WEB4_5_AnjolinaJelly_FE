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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

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
      const brandMap = new Map<string, BrandFetchResponse>();
      for (const typeName of selectedTypes) {
        // typeName을 이용해 typeId를 찾음
        const typeObj = types.find((t) => t.name === typeName);
        if (!typeObj?.typeId) continue;
        const res = await client.api.findBrandByType({
          typeId: typeObj.typeId,
        });
        (res.result ?? []).forEach((b) => {
          if (b.name) brandMap.set(b.name, b);
        });
      }
      setBrands(Array.from(brandMap.values()));
      // 선택된 브랜드 중, 현재 브랜드 목록에 없는 것은 해제
      setSelectedBrands((prev) => prev.filter((name) => brandMap.has(name)));
    };
    fetchBrands();
  }, [selectedTypes, types]);

  // 체크박스 핸들러
  const handleTypeChange = (typeName: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((name) => name !== typeName)
        : [...prev, typeName]
    );
  };
  const handleBrandChange = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((name) => name !== brandName)
        : [...prev, brandName]
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
                  checked={selectedTypes.includes(type.name ?? "")}
                  onChange={() => handleTypeChange(type.name ?? "")}
                  disabled={type.name === undefined}
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
            .filter((t) => selectedTypes.includes(t.name ?? ""))
            .map((t) => (
              <Chip
                key={t.typeId}
                label={t.name}
                onDelete={() => handleTypeChange(t.name ?? "")}
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
                    checked={selectedBrands.includes(brand.name ?? "")}
                    onChange={() => handleBrandChange(brand.name ?? "")}
                    disabled={brand.name === undefined}
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
            .filter((b) => selectedBrands.includes(b.name ?? ""))
            .map((b) => (
              <Chip
                key={b.brandId}
                label={b.name}
                onDelete={() => handleBrandChange(b.name ?? "")}
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
