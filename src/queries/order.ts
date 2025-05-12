import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/api/zzirit/client";
import { PaymentRequestDto } from "@/api/zzirit/models";

// 결제(주문 생성) mutation
export function useInitOrderMutation() {
  return useMutation({
    mutationFn: async (paymentRequestDto: PaymentRequestDto) => {
      return client.payments.initOrder({ paymentRequestDto });
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
