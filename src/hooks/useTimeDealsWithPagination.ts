import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { client } from "@/api/zzirit/client";
import { TimeDealFetchResponse } from "@/api/zzirit/models";

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

// 검색 옵션 타입 정의
export type TimeDealSearchField = "timeDealName" | "timeDealId";

export function useTimeDealsWithPagination(initialPage = 1) {
  const [timeDeals, setTimeDeals] = useState<TimeDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  // 검색 관련 상태
  const [searchField, setSearchField] =
    useState<TimeDealSearchField>("timeDealName");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [activeSearchField, setActiveSearchField] =
    useState<TimeDealSearchField>("timeDealName");

  const fetchTimeDeals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 검색 파라미터 설정
      const params = {
        page: currentPage - 1, // API는 0부터 시작하는 페이지 인덱스 사용
        size: 10,
      } as Record<string, string | number>;

      // 검색어가 있는 경우 검색 필드에 따라 파라미터 추가
      if (activeSearchQuery) {
        params[activeSearchField] = activeSearchQuery;
      }

      const response = await client.api.searchTimeDeals(params);

      if (response.success && response.result) {
        // 타임딜 데이터에 selected 속성 추가
        const apiTimeDeals =
          response.result.content?.map((deal: TimeDealFetchResponse) => {
            // TimeDealFetchItem을 TimeDealItem으로 변환
            const timeDealItems: TimeDealItem[] =
              deal.items?.map((item) => ({
                itemId: item.itemId || 0,
                itemName: item.itemName || "",
                quantity: item.quantity || 0,
                originalPrice: item.originalPrice || 0,
                finalPrice: item.discountedPrice || 0, // API의 discountedPrice를 finalPrice로 매핑
              })) || [];

            return {
              timeDealId: deal.timeDealId || 0,
              timeDealName: deal.timeDealName || "",
              startTime: deal.startTime ? deal.startTime.toString() : "",
              endTime: deal.endTime ? deal.endTime.toString() : "",
              status: (deal.status || "ENDED") as
                | "ONGOING"
                | "UPCOMING"
                | "ENDED",
              discountRate: deal.discountRatio || 0, // discountRatio가 올바른 필드명
              items: timeDealItems,
              selected: false,
            };
          }) || [];

        setTimeDeals(apiTimeDeals);
        if (response.result.totalPages !== undefined) {
          setTotalPages(response.result.totalPages);
        }
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
  }, [currentPage, activeSearchField, activeSearchQuery]);

  useEffect(() => {
    fetchTimeDeals();
  }, [fetchTimeDeals]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 검색 필드 변경 핸들러
  const handleSearchFieldChange = (field: TimeDealSearchField) => {
    setSearchField(field);
  };

  // 검색어 변경 핸들러
  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  // 검색 실행 핸들러
  const handleSearch = () => {
    setActiveSearchField(searchField);
    setActiveSearchQuery(searchQuery);
    setIsSearching(!!searchQuery);
    setCurrentPage(1); // 검색 시 항상 1페이지부터 시작
  };

  // 검색 초기화 핸들러
  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
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
    searchField,
    searchQuery,
    isSearching,
    handlePageChange,
    handleSelectAll,
    handleSelectOne,
    handleSearchFieldChange,
    handleSearchQueryChange,
    handleSearch,
    handleClearSearch,
    refreshTimeDeals: fetchTimeDeals,
  };
}
