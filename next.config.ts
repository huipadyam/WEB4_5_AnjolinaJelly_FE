import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "source.unsplash.com",
      "i.postimg.cc",
      "team03-zzirit-bucket.s3.ap-northeast-2.amazonaws.com",
    ],
  },
};

export default nextConfig;
