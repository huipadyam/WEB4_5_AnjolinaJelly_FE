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
