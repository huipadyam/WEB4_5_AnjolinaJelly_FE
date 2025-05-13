import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/api/zzirit/client";
import { CartItemResponse } from "@/api/zzirit/models/CartItemResponse";
import { cartKeys } from "./queryKeys";

// CartPage에서 사용할 CartItem 타입 (UI에 맞게 변환)
export interface CartItem {
  itemId: number;
  name: string;
  imageUrl?: string;
  price?: number;
  quantity?: number;
  type?: string;
  brand?: string;
  timeDealStatus?: string;
  endTimeDeal?: string;
  stock?: number;
  discountRatio?: number;
  originalPrice?: number;
}

export function useCartQuery() {
  return useQuery<CartItem[]>({
    queryKey: cartKeys.all,
    queryFn: async () => {
      const res = await client.api.getMyCart();
      // CartItemResponse[] -> CartItem[] 변환
      return (res.result?.items ?? []).map((item: CartItemResponse) => ({
        itemId: item.itemId ?? 0,
        name: item.itemName ?? "",
        imageUrl: item.imageUrl,
        price: item.discountedPrice ?? item.originalPrice ?? 0,
        quantity: item.quantity ?? 1,
        type: item.type,
        brand: item.brand,
        discountRatio: item.discountRatio,
        originalPrice: item.originalPrice,
        // timeDealStatus, endTimeDeal, stock 등은 필요시 추가
      }));
    },
  });
}

export function useIncreaseCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => client.api.increaseQuantity({ itemId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useDecreaseCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => client.api.decreaseQuantity({ itemId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => client.api.removeItemToCart({ itemId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}
