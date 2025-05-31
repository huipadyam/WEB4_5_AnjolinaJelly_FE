"use client";

import React, { useState } from "react";

// 20개의 임시 이미지 링크 배열
const fallbackImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
];

const getFallbackIndex = (key: string) => {
  const num = parseInt(key.replace(/\D/g, ""), 10);
  if (isNaN(num)) return 0;
  return num % fallbackImages.length;
};

type ImageWithFallbackProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  src: string;
  alt: string;
  fallbackKey?: string;
};

export default function ImageWithFallback(props: ImageWithFallbackProps) {
  const { src, alt, fallbackKey = "", width, height, ...rest } = props;
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [errorCount, setErrorCount] = useState(0);

  const handleError = () => {
    if (errorCount === 0) {
      const idx = getFallbackIndex(fallbackKey || src);
      setImgSrc(fallbackImages[idx] + "?v=" + Date.now());
      setErrorCount((c) => c + 1);
    }
  };

  // errorCount가 1 이상이면 <img> fallback, 아니면 <img> 사용
  // if (errorCount === 0) {
  //   return (
  //     <img
  //       src={src}
  //       alt={alt}
  //       width={Number(width ?? 100)}
  //       height={Number(height ?? 100)}
  //       onError={handleError}
  //       {...rest}
  //     />
  //   );
  // }

  return (
    <img
      key={String(imgSrc) + errorCount}
      src={String(imgSrc)}
      alt={alt}
      width={Number(width ?? 400)}
      height={Number(height ?? 80)}
      onError={handleError}
      {...rest}
    />
  );
}
