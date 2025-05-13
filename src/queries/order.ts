import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { client } from "@/api/zzirit/client";
import { PaymentRequest } from "@/api/zzirit/models/PaymentRequest";
import { orderKeys } from "./queryKeys";
import type { PageResponseOrderFetchResponse } from "@/api/zzirit/models/PageResponseOrderFetchResponse";
import type { InfiniteData } from "@tanstack/react-query";

// 결제(주문 생성) mutation
export function useInitOrderMutation() {
  return useMutation({
    mutationFn: async (paymentRequest: PaymentRequest) => {
      return client.payments.initOrder({ paymentRequest });
    },
  });
}

// 결제 성공 mutation
export function useConfirmPaymentMutation() {
  return useMutation({
    mutationFn: async ({
      paymentKey,
      orderId,
      amount,
    }: {
      paymentKey: string;
      orderId: string;
      amount: string;
    }) => {
      return client.payments.confirmPayment({ paymentKey, orderId, amount });
    },
  });
}

// 결제 실패 mutation
export function useFailPaymentMutation() {
  return useMutation({
    mutationFn: async ({
      code,
      message,
      orderId,
    }: {
      code?: string;
      message?: string;
      orderId?: string;
    }) => {
      return client.payments.failPayment({ code, message, orderId });
    },
  });
}

// 주문 취소 mutation (필요시)
export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      return client.api.cancelOrder({ orderId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useGetMyOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: async () => {
      return client.api.fetchAllOrders();
    },
    select: (data) => data.result,
  });
}

export function useGetMyOrdersInfinite() {
  return useInfiniteQuery<
    PageResponseOrderFetchResponse,
    Error,
    InfiniteData<PageResponseOrderFetchResponse>,
    readonly [string],
    number
  >({
    queryKey: orderKeys.all,
    queryFn: async ({ pageParam = 0 }) => {
      const res = await client.api.fetchAllOrders({
        page: Number(pageParam),
        size: 10,
      });
      return res.result!;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.last) return undefined;
      return (lastPage.pageNumber ?? 0) + 1;
    },
    initialPageParam: 0,
  });
}
