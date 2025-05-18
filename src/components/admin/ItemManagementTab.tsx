"use client";

import React, { useState } from "react";
import ItemTable from "@/components/admin/ItemTable";
import ItemManagementHeader from "@/components/admin/ItemManagementHeader";
import ItemDeleteModal from "@/components/admin/ItemDeleteModal";
import TimeDealCreateModal from "@/components/admin/TimeDealCreateModal";
import AlertSnackbar, { alertService } from "@/components/admin/AlertSnackbar";
import Pagination from "@/components/admin/Pagination";
import { useItemsWithPagination } from "@/hooks/useItemsWithPagination";

export default function ItemManagementTab() {
  const {
    items,
    loading: itemsLoading,
    isPageChanging,
    currentPage: itemsCurrentPage,
    totalPages: itemsTotalPages,
    selectAll: itemsSelectAll,
    searchField,
    searchQuery,
    isSearching,
    handlePageChange: handleItemsPageChange,
    handleSelectAll: handleItemsSelectAll,
    handleSelectOne: handleItemsSelectOne,
    handleSearchFieldChange,
    handleSearchQueryChange,
    handleSearch,
    handleClearSearch,
    updateItem: handleUpdateItem,
    deleteSelectedItems,
    getSelectedItems,
    refreshItems,
  } = useItemsWithPagination();

  // 삭제 모달 상태
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // 타임딜 생성 모달 상태
  const [timeDealModalOpen, setTimeDealModalOpen] = useState(false);

  // 선택된 아이템 개수
  const selectedItemsCount = items.filter((item) => item.selected).length;

  // 삭제 모달 열기
  const handleOpenDeleteModal = () => {
    if (selectedItemsCount > 0) {
      setDeleteModalOpen(true);
    }
  };

  // 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  // 타임딜 생성 모달 열기
  const handleOpenTimeDealModal = () => {
    setTimeDealModalOpen(true);
  };

  // 타임딜 생성 모달 닫기
  const handleCloseTimeDealModal = () => {
    setTimeDealModalOpen(false);
  };

  // 삭제 확인
  const handleConfirmDelete = async () => {
    try {
      const result = await deleteSelectedItems();

      if (result.success) {
        alertService.showAlert(
          `${result.deletedCount}개의 상품이 성공적으로 삭제되었습니다.`,
          "success"
        );
      } else {
        alertService.showAlert("상품 삭제 중 오류가 발생했습니다.", "error");
      }
    } catch (err) {
      console.error("삭제 확인 중 오류 발생:", err);
      alertService.showAlert("상품 삭제 중 오류가 발생했습니다.", "error");
    } finally {
      handleCloseDeleteModal();
    }
  };

  // 아이템 추가 후 처리
  const handleItemAdded = () => {
    // 아이템 목록을 새로고침
    refreshItems();
    alertService.showAlert("새 상품이 목록에 추가되었습니다.", "success");
  };

  return (
    <>
      <ItemManagementHeader
        onDelete={handleOpenDeleteModal}
        selectedItemsCount={selectedItemsCount}
        onCreateTimeDeal={handleOpenTimeDealModal}
        onItemAdded={handleItemAdded}
        searchField={searchField}
        searchQuery={searchQuery}
        onSearchFieldChange={handleSearchFieldChange}
        onSearchQueryChange={handleSearchQueryChange}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        isSearching={isSearching}
      />

      <ItemTable
        items={items}
        page={itemsCurrentPage}
        selectAll={itemsSelectAll}
        onSelectAll={handleItemsSelectAll}
        onSelectOne={handleItemsSelectOne}
        onUpdateItem={handleUpdateItem}
        loading={itemsLoading}
        isPageChanging={isPageChanging}
        isSearching={isSearching}
      />

      <Pagination
        currentPage={itemsCurrentPage}
        totalPages={itemsTotalPages}
        onPageChange={handleItemsPageChange}
      />

      {/* 삭제 확인 모달 */}
      <ItemDeleteModal
        open={deleteModalOpen}
        selectedItems={getSelectedItems()}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* 타임딜 생성 모달 */}
      <TimeDealCreateModal
        open={timeDealModalOpen}
        onClose={handleCloseTimeDealModal}
        selectedItems={getSelectedItems()}
      />

      {/* 전역 알림 스낵바 */}
      <AlertSnackbar />
    </>
  );
}
