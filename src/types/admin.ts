export interface Item {
  id: number;
  image: string;
  name: string;
  itemNumber: number;
  stock: number;
  category: string;
  brand: string;
  price: number;
  selected: boolean;
}

export interface ApiProduct {
  id: number;
  name: string;
  imageUrl: string;
  stockQuantity: number;
  type: string;
  brand: string;
  price: number;
}

export interface PaginationResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  httpStatus: number;
  message: string;
  result: T;
}
