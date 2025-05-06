import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ImageWithFallback from "./ImageWithFallback";

interface ProductCardProps {
  image: string;
  name: string;
  category: string;
  price: number;
}

export default function ProductCard({
  image,
  name,
  category,
  price,
}: ProductCardProps) {
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
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {category}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={700}
          color="primary.main"
          mt={1}
        >
          {price.toLocaleString()}원
        </Typography>
      </CardContent>
    </Card>
  );
}
