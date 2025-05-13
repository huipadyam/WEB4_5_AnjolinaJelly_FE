import { useQuery } from "@tanstack/react-query";
import { client } from "@/api/zzirit/client";
import { myPageKeys } from "./queryKeys";

// 내 정보 조회 쿼리 훅
export function useGetMyPageInfo() {
  return useQuery({
    queryKey: myPageKeys.all,
    queryFn: async () => {
      return await client.auth.getMyPageInfo();
    },
    select: (data) => data.result,
  });
}
