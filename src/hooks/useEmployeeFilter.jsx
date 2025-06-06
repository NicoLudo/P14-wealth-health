import { useMemo } from "react";

const useEmployeeFilter = (employees, searchTerm, sortField, sortOrder) =>
  useMemo(() => {
    const s = searchTerm.toLowerCase();
    let filtered = employees.filter(emp =>
      Object.values(emp).some(val => val?.toString().toLowerCase().includes(s))
    );
    if (sortField)
      filtered = [...filtered].sort((a, b) =>
        a[sortField] < b[sortField] ? (sortOrder === "asc" ? -1 : 1)
        : a[sortField] > b[sortField] ? (sortOrder === "asc" ? 1 : -1)
        : 0
      );
    return filtered;
  }, [employees, searchTerm, sortField, sortOrder]);

export default useEmployeeFilter;
