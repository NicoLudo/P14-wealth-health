import { useState, useContext, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "../assets/scss/pages/employee-list.scss";
import { EmployeeContext } from "../context/EmployeeContext";
import useEmployeeFilter from "../hooks/useEmployeeFilter";
import usePagination from "../hooks/usePagination";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";

const BASE_COLUMNS = [
  "firstName", "lastName", "startDate", "department",
  "dateOfBirth", "street", "city", "state", "zipCode",
];

function EmployeeList() {
  const { employees, clearEmployees } = useContext(EmployeeContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);

  const filtered = useEmployeeFilter(employees, searchTerm);

  const columns = useMemo(() =>
    BASE_COLUMNS.map(key => ({
      header: key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase()),
      accessorKey: key,
      enableSorting: !["firstName", "lastName", "street"].includes(key),
    })), []);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const sortedRows = table.getSortedRowModel().rows.map(r => r.original);

  const { paginatedData, totalPages, startEntry, endEntry } =
    usePagination(sortedRows, pageSize, currentPage);

  const handleInput = useCallback(setter => e => {
    setter(e.target.type === "number" ? +e.target.value : e.target.value);
    setCurrentPage(1);
  }, []);

  const setPage = useCallback(setCurrentPage, []);

  const toggleSort = useCallback(header => {
    if (!header.column.getCanSort()) return;
    const id = header.column.id;
    setSorting(([current]) => [{
      id,
      desc: current?.id === id ? !current.desc : false,
    }]);
  }, []);

  const clearAll = useCallback(() => {
    clearEmployees();
    setSearchTerm("");
    setCurrentPage(1);
  }, [clearEmployees]);

  return (
    <div className="employee-list">
      <h1 className="employee-list__title" aria-label="Current Employees">Current Employees</h1>
      <Link to="/" className="employee-list__link">Home</Link>

      <div className="employee-list__controls">
        <label htmlFor="pageSizeSelect">
          Show
          <select id="pageSizeSelect" value={pageSize} onChange={handleInput(setPageSize)} aria-label="Number of entries per page">
            {[5, 10, 25, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          entries
        </label>

        <label htmlFor="searchInput">
          Search:
          <input
            id="searchInput"
            type="text"
            value={searchTerm}
            onChange={handleInput(setSearchTerm)}
            placeholder="Search employees..."
            aria-label="Search for an employee"
          />
        </label>
      </div>

      <div aria-label="Employee list">
        <table className="employee-list__table">
          <thead>
            {table.getHeaderGroups().map(group => (
              <tr key={group.id}>
                {group.headers.map(header => {
                  const id = header.column.id;
                  const isSorted = sorting[0]?.id === id;
                  return (
                    <th
                      key={id}
                      onClick={() => toggleSort(header)}
                      style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                      scope="col"
                      aria-sort={isSorted ? (sorting[0].desc ? "descending" : "ascending") : "none"}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {isSorted && (sorting[0].desc ? " 🔽" : " 🔼")}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {paginatedData.length ? paginatedData.map((row, i) => (
              <tr key={i}>
                {columns.map(({ accessorKey }) => (
                  <td key={accessorKey} data-label={accessorKey}>
                    {row[accessorKey]}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="employee-list__nodata" role="alert">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="employee-list__controls employee-list__controls--bottom">
        <p aria-live="polite">
          Showing entries {startEntry} – {endEntry} of {filtered.length}
        </p>

        <nav className="employee-list__pagination" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setPage(page)}
                disabled={page === currentPage}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
        </nav>
      </div>

      <button onClick={clearAll} className="employee-list__clear-button">
        Clear All Data
      </button>
    </div>
  );
}

export default EmployeeList;
