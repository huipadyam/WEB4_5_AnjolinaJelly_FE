import { useState, useEffect } from "react";
import { client } from "@/api/zzirit/client";
import {
  Item,
  ApiProduct,
  PaginationResponse,
  ApiResponse,
} from "@/types/admin";

// UpdateItemRequest 타입 정의
interface UpdateItemRequest {
  itemId: number;
  itemCreateRequest: {
    name?: string;
    stockQuantity?: number;
    price?: number;
    typeId?: number;
    brandId?: number;
  };
}

export function useItemsWithPagination(initialPage = 1) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(3);
  const [error, setError] = useState<Error | null>(null);
  const [selectAll, setSelectAll] = useState(false);

  const updateItem = async (itemData: UpdateItemRequest): Promise<void> => {
    try {
      // API 호출
      await client.updateItem(itemData);

      fetchItems();
    } catch (error) {
      console.error("상품 업데이트 중 오류 발생:", error);
      throw error;
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await client.getItems(currentPage);
      const data = (await response.json()) as ApiResponse<
        PaginationResponse<ApiProduct>
      >;

      if (data.success && data.result) {
        const apiItems = data.result.content.map((item: ApiProduct) => ({
          id: item.id,
          image: item.imageUrl,
          name: item.name,
          itemNumber: item.id,
          stock: item.stockQuantity,
          category: item.type,
          brand: item.brand,
          price: item.price,
          selected: false,
        }));

        setItems(apiItems);
        setTotalPages(data.result.totalPages);
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
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        await client.deleteItem({ itemId });
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
    error,
    currentPage,
    totalPages,
    selectAll,
    handlePageChange,
    handleSelectAll,
    handleSelectOne,
    updateItem,
    deleteSelectedItems,
    getSelectedItems,
    refreshItems: fetchItems,
  };
}
