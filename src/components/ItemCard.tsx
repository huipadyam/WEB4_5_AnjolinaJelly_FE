"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Stack } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ImageWithFallback from "./ImageWithFallback";
import Link from "next/link";
import { SimpleItemFetchResponse } from "@/api/zzirit";

export default function ItemCard({
  imageUrl,
  name,
  type,
  discountedPrice,
  itemId,
  itemStatus,
  originalPrice,
  discountRatio,
  endTimeDeal,
}: SimpleItemFetchResponse) {
  const timeLeft = useTimeLeft(endTimeDeal);
  // 타임딜 카드
  if (itemStatus === "TIME_DEAL") {
    return (
      <Link href={`/items/${itemId}`}>
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
              src={imageUrl ?? ""}
              alt={name ?? ""}
              fallbackKey={imageUrl}
              style={{ width: "100%", height: 140, objectFit: "cover" }}
            />
          </div>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon color="error" fontSize="small" />
              <Typography
                variant="body2"
                color="error"
                fontWeight={700}
                sx={{ width: 56, display: "inline-block" }}
              >
                {timeLeft}
              </Typography>
              <Typography
                variant="body2"
                color="secondary"
                fontWeight={700}
                sx={{ ml: "auto", bgcolor: "#E3F2FD", px: 1, borderRadius: 1 }}
              >
                {discountRatio ?? 0}% 할인
              </Typography>
            </Stack>
            <Typography variant="subtitle1" fontWeight={600} mt={1} noWrap>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {type}
            </Typography>
            <Stack direction="row" alignItems="baseline" spacing={1} mt={1}>
              <Typography
                variant="body1"
                fontWeight={700}
                color="secondary.main"
              >
                {discountedPrice?.toLocaleString()}원
              </Typography>
              <Typography
                variant="body2"
                color="text.disabled"
                sx={{ textDecoration: "line-through" }}
              >
                {(originalPrice ?? 0).toLocaleString()}원
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // 일반 카드
  return (
    <Link href={`/items/${itemId}`}>
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
            src={imageUrl ?? ""}
            alt={name ?? ""}
            fallbackKey={imageUrl}
            style={{ width: "100%", height: 140, objectFit: "cover" }}
          />
        </div>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {type}
          </Typography>
          <Typography
            variant="body1"
            fontWeight={700}
            color="secondary.main"
            mt={1}
          >
            {originalPrice?.toLocaleString()}원
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

function getTimeLeftString(endTimeDeal?: Date): string {
  if (!endTimeDeal) return "00:00:00";
  const now = new Date();
  const diff = Math.max(0, endTimeDeal.getTime() - now.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function useTimeLeft(endTimeDeal?: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeftString(endTimeDeal));
  useEffect(() => {
    if (!endTimeDeal) return;
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeftString(endTimeDeal));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTimeDeal]);
  return timeLeft;
}
