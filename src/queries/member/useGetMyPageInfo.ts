import { useQuery } from "@tanstack/react-query";
import { client } from "@/api/zzirit/client";
import type { BaseResponseMyPageInfoDTO } from "@/api/zzirit/models/BaseResponseMyPageInfoDTO";

// 내 정보 조회 쿼리 훅
export function useGetMyPageInfo() {
  return useQuery<BaseResponseMyPageInfoDTO, Error>({
    queryKey: ["myPageInfo"],
    queryFn: async () => {
      return await client.auth.getMyPageInfo();
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh
  });
}
