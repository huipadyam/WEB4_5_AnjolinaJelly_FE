import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { client } from "@/api/zzirit/client";
import { itemKeys, timeDealKeys } from "./queryKeys";
import { PageResponseItemFetchQueryResponse } from "@/api/zzirit";

// 상품 상세 조회 쿼리
export function useItemDetailQuery(id: number) {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => client.api.getById({ itemId: id }),
    enabled: !!id,
  });
}

// 장바구니 담기 뮤테이션
export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { itemId: number; quantity: number }) =>
      client.api.addItemToCart({
        cartItemCreateRequest: {
          itemId: params.itemId,
          quantity: params.quantity,
        },
      }),
    onSuccess: () => {
      // 장바구니 쿼리 무효화 등 필요시 추가
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// 진행 중인 타임딜 상품 목록 쿼리
export function useCurrentTimeDealItemsQuery() {
  return useQuery({
    queryKey: timeDealKeys.all,
    queryFn: async () => {
      const res = await client.api.getCurrentTimeDeals();
      if (!res.result || !res.result.content) return [];
      return res.result.content;
    },
  });
}

// 상품 목록 무한스크롤 쿼리
export interface InfiniteItemsQueryParams {
  pageSize?: number;
  keyword?: string;
  types?: string[];
  brands?: string[];
  sort?: string;
}

export function useInfiniteItemsQuery(params: InfiniteItemsQueryParams = {}) {
  const { pageSize = 20, keyword, types, brands, sort } = params;
  return useInfiniteQuery<PageResponseItemFetchQueryResponse, Error>({
    queryKey: [itemKeys.all, { keyword, types, brands, sort }],
    queryFn: async (ctx: QueryFunctionContext) => {
      const pageParam = ctx.pageParam as number | undefined;
      const page = typeof pageParam === "number" ? pageParam : 1;
      const res = await client.api.search({
        page,
        size: pageSize,
        keyword,
        types: types?.join(","),
        brands: brands?.join(","),
        sort,
      });
      return res.result!;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.last) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 0,
  });
}
