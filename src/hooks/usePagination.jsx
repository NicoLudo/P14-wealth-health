import { useMemo } from "react";

const usePagination = (data, pageSize, currentPage) => {
  const totalPages = Math.ceil(data.length / pageSize);
  const startEntry = data.length ? (currentPage - 1) * pageSize + 1 : 0;
  const endEntry = Math.min(currentPage * pageSize, data.length);
  const paginatedData = useMemo(() => data.slice((currentPage - 1) * pageSize, currentPage * pageSize), [data, pageSize, currentPage]);
  return { paginatedData, totalPages, startEntry, endEntry };
};

export default usePagination;
