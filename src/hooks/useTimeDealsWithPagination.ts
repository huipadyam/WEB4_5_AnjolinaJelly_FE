import { useState, useEffect, ChangeEvent } from "react";
import { client } from "@/api/zzirit/client";

// 타임딜 관련 타입 정의
interface TimeDealItem {
  itemId: number;
  itemName: string;
  quantity: number;
  originalPrice: number;
  finalPrice: number;
}

export interface TimeDeal {
  timeDealId: number;
  timeDealName: string;
  startTime: string;
  endTime: string;
  status: "ONGOING" | "UPCOMING" | "ENDED";
  discountRate: number;
  items: TimeDealItem[];
  selected?: boolean;
}

interface TimeDealApiResponse {
  success: boolean;
  code: number;
  httpStatus: number;
  message: string;
  result: {
    content: TimeDeal[];
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
    totalElements: number;
    totalPages: number;
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
  };
}

export function useTimeDealsWithPagination(initialPage = 1) {
  const [timeDeals, setTimeDeals] = useState<TimeDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchTimeDeals = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await client.getTimeDeals(currentPage);
        const data = (await response.json()) as TimeDealApiResponse;

        if (data.success && data.result) {
          // 타임딜 데이터에 selected 속성 추가
          const apiTimeDeals = data.result.content.map((deal) => ({
            ...deal,
            selected: false,
          }));

          setTimeDeals(apiTimeDeals);
          setTotalPages(data.result.totalPages);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("알 수 없는 오류가 발생했습니다.")
        );
        console.error("타임딜 데이터를 불러오는 데 실패했습니다:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeDeals();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectAll(event.target.checked);
    setTimeDeals(
      timeDeals.map((deal) => ({
        ...deal,
        selected: event.target.checked,
      }))
    );
  };

  const handleSelectOne = (id: number) => {
    const updatedTimeDeals = timeDeals.map((deal) =>
      deal.timeDealId === id ? { ...deal, selected: !deal.selected } : deal
    );
    setTimeDeals(updatedTimeDeals);
    setSelectAll(updatedTimeDeals.every((deal) => deal.selected));
  };

  return {
    timeDeals,
    loading,
    error,
    currentPage,
    totalPages,
    selectAll,
    handlePageChange,
    handleSelectAll,
    handleSelectOne,
  };
}
