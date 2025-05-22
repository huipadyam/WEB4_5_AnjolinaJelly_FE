export const myPageKeys = {
  all: ["myPageInfo"] as const,
};

export const itemKeys = {
  all: ["items"] as const,
  detail: (id: number) => [...itemKeys.all, "detail", id] as const,
};

export const timeDealKeys = {
  all: ["currentTimeDeals"] as const,
};

export const cartKeys = {
  all: ["cart"] as const,
};

export const orderKeys = {
  all: ["orders"] as const,
  confirmPayment: (orderId: string, paymentKey: string, amount: string) =>
    [...orderKeys.all, "confirmPayment", orderId, paymentKey, amount] as const,
  failPayment: (orderId: string) =>
    [...orderKeys.all, "failPayment", orderId] as const,
};
