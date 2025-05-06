import React from "react";
import { Card, CardContent, Typography, Stack } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ImageWithFallback from "./ImageWithFallback";

interface TimeDealProductCardInGridProps {
  image: string;
  name: string;
  category: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  timeLeft: string;
}

export default function TimeDealProductCardInGrid({
  image,
  name,
  category,
  originalPrice,
  dealPrice,
  discount,
  timeLeft,
}: TimeDealProductCardInGridProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 2px 8px 0 rgba(80, 100, 120, 0.08)",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div style={{ width: "100%", height: 140, overflow: "hidden" }}>
        <ImageWithFallback
          src={image}
          alt={name}
          fallbackKey={image}
          style={{ width: "100%", height: 140, objectFit: "cover" }}
        />
      </div>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccessTimeIcon color="error" fontSize="small" />
          <Typography variant="body2" color="error" fontWeight={700}>
            {timeLeft}
          </Typography>
          <Typography
            variant="body2"
            color="primary"
            fontWeight={700}
            sx={{ ml: "auto", bgcolor: "#E3F2FD", px: 1, borderRadius: 1 }}
          >
            {discount}% 할인
          </Typography>
        </Stack>
        <Typography variant="subtitle1" fontWeight={600} mt={1} noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {category}
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={1} mt={1}>
          <Typography variant="body1" fontWeight={700} color="primary.main">
            {dealPrice.toLocaleString()}원
          </Typography>
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ textDecoration: "line-through" }}
          >
            {originalPrice.toLocaleString()}원
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
