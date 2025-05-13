import { useState, useEffect, useCallback } from "react";
import { client } from "@/api/zzirit/client";
import { Item } from "@/types/admin";
import {
  AdminItemFetchResponse,
  BaseResponsePageResponseAdminItemFetchResponse,
} from "@/api/zzirit/models";

// 내부 인터페이스 정의
interface UpdateItemRequest {
  itemId: number;
  itemUpdateRequest?: {
    stockQuantity?: number;
    price?: number;
  };
  itemCreateRequest?: {
    name?: string;
    stockQuantity?: number;
    price?: number;
    typeId?: number;
    brandId?: number;
  };
}

// 검색 옵션 타입 정의
export type SearchField = "name" | "itemId";

export function useItemsWithPagination(initialPage = 1) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(3);
  const [error, setError] = useState<Error | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  // 검색 관련 상태
  const [searchField, setSearchField] = useState<SearchField>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [activeSearchField, setActiveSearchField] =
    useState<SearchField>("name");

  const updateItem = async (itemData: UpdateItemRequest): Promise<void> => {
    try {
      // 전달된 데이터 구조에 따라 API 호출 형식 분기 처리
      if (itemData.itemUpdateRequest) {
        // 기존 형식: { itemId, itemUpdateRequest: { ... } }
        await client.api.updateItem({
          itemId: itemData.itemId,
          itemUpdateRequest: {
            stockQuantity: itemData.itemUpdateRequest.stockQuantity,
            price: itemData.itemUpdateRequest.price,
          },
        });
      } else if (itemData.itemCreateRequest) {
        // ItemEditModal에서 전달하는 형식: { itemId, itemCreateRequest: { ... } }
        await client.api.updateItem({
          itemId: itemData.itemId,
          itemUpdateRequest: {
            stockQuantity: itemData.itemCreateRequest.stockQuantity,
            price: itemData.itemCreateRequest.price,
          },
        });
      } else {
        console.error("지원되지 않는 데이터 형식:", itemData);
        throw new Error("지원되지 않는 데이터 형식");
      }

      fetchItems();
    } catch (error) {
      console.error("상품 업데이트 중 오류 발생:", error);
      throw error;
    }
  };

  const fetchItems = useCallback(async () => {
    try {
      if (items.length > 0) {
        setIsPageChanging(true);
      } else {
        setLoading(true);
      }
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

      // APIApi 클라이언트 사용
      const response: BaseResponsePageResponseAdminItemFetchResponse =
        await client.api.getItems(params);

      if (response.success && response.result) {
        const apiItems =
          response.result.content?.map((item: AdminItemFetchResponse) => ({
            id: item.id || 0,
            image: item.imageUrl || "",
            name: item.name || "",
            itemNumber: item.id || 0,
            stock: item.stockQuantity || 0,
            category: item.type || "",
            brand: item.brand || "",
            price: item.price || 0,
            selected: false,
          })) || [];

        setItems(apiItems);
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
      console.error("상품 데이터를 불러오는 데 실패했습니다:", err);
    } finally {
      setLoading(false);
      setIsPageChanging(false);
    }
  }, [currentPage, activeSearchField, activeSearchQuery]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 검색 필드 변경 핸들러
  const handleSearchFieldChange = (field: SearchField) => {
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

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(event.target.checked);
    setItems((prev) =>
      prev.map((item) => ({ ...item, selected: event.target.checked }))
    );
  };

  const handleSelectOne = (id: number) => {
    setItems((prev) => {
      const updatedItems = prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      );
      // 모든 항목이 선택되었는지 확인하여 selectAll 상태 업데이트
      const allSelected = updatedItems.every((item) => item.selected);
      setSelectAll(allSelected);
      return updatedItems;
    });
  };

  // 선택된 아이템 삭제
  const deleteSelectedItems = async (): Promise<{
    success: boolean;
    deletedCount: number;
    itemIds: number[];
  }> => {
    try {
      // 선택된 아이템의 ID 목록 생성
      const selectedItemIds = items
        .filter((item) => item.selected)
        .map((item) => item.id);

      if (selectedItemIds.length === 0) {
        return { success: false, deletedCount: 0, itemIds: [] };
      }

      // 각 아이템을 순차적으로 삭제
      for (const itemId of selectedItemIds) {
        await client.api.deleteItem({ itemId });
      }

      // 삭제 후 아이템 리스트 새로고침
      await fetchItems();

      return {
        success: true,
        deletedCount: selectedItemIds.length,
        itemIds: selectedItemIds,
      };
    } catch (error) {
      console.error("상품 삭제 중 오류 발생:", error);
      return { success: false, deletedCount: 0, itemIds: [] };
    }
  };

  // 선택된 아이템 정보 가져오기
  const getSelectedItems = () => {
    return items.filter((item) => item.selected);
  };

  return {
    items,
    loading,
    isPageChanging,
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
    updateItem,
    deleteSelectedItems,
    getSelectedItems,
    refreshItems: fetchItems,
  };
}
