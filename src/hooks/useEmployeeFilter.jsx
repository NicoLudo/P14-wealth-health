import { useMemo } from "react";

const useEmployeeFilter = (employees, searchTerm, sortField, sortOrder) => {
  return useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = employees.filter((employee) =>
      Object.values(employee).some((val) =>
        val.toString().toLowerCase().includes(lowerSearch)
      )
    );

    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [employees, searchTerm, sortField, sortOrder]);
};

export default useEmployeeFilter;
