import { useMemo } from "react";

const usePagination = (data, pageSize, currentPage) => {
  const totalPages = Math.ceil(data.length / pageSize);
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, data.length);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, pageSize, currentPage]);

  return { paginatedData, totalPages, startEntry, endEntry };
};

export default usePagination;
