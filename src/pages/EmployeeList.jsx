import { useState, useContext, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "../assets/scss/pages/employee-list.scss";
import { EmployeeContext } from "../context/EmployeeContext";
import useEmployeeFilter from "../hooks/useEmployeeFilter";
import usePagination from "../hooks/usePagination";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";

const columnsDef = [
  { header: "First Name", accessorKey: "firstName", enableSorting: false },
  { header: "Last Name", accessorKey: "lastName", enableSorting: false },
  { header: "Start Date", accessorKey: "startDate" },
  { header: "Department", accessorKey: "department" },
  { header: "Date of Birth", accessorKey: "dateOfBirth" },
  { header: "Street", accessorKey: "street", enableSorting: false },
  { header: "City", accessorKey: "city" },
  { header: "State", accessorKey: "state" },
  { header: "Zip Code", accessorKey: "zipCode" },
];

function EmployeeList() {
  const { employees, clearEmployees } = useContext(EmployeeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState([]);

  const filteredData = useEmployeeFilter(employees, searchTerm);
  const { paginatedData, totalPages, startEntry, endEntry } = usePagination( filteredData, pageSize, currentPage );

  const columns = useMemo(
    () =>
      columnsDef.map((col) => ({
        header: col.header,
        accessorKey: col.accessorKey,
        enableSorting: col.enableSorting !== false,
      })),
    []
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);
  const handlePageSizeChange = useCallback((e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  }, []);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  const handleSort = useCallback(
    (col) => {
      if (!col.column.getCanSort()) return;
      setSorting((old) => {
        const isAsc =
          old[0] && old[0].id === col.column.id && old[0].desc === false;
        return [{ id: col.column.id, desc: !isAsc }];
      });
    },
    []
  );

  const clearAllData = () => {
    clearEmployees();
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="employee-list">
      <h1 className="employee-list__title" aria-label="Current Employees">
        Current Employees
      </h1>
      <Link to="/" className="employee-list__link" title="Go back to Home">
        Home
      </Link>

      <div className="employee-list__controls">
        <label htmlFor="pageSize">
          Show
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            aria-label="Number of entries per page"
          >
            {[5, 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          entries
        </label>
        <label htmlFor="search">
          Search:
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search employees..."
            aria-label="Search for an employee"
          />
        </label>
      </div>

      <div aria-label="Liste des employés" style={{ overflowX: "auto" }}>
        <table
          className="employee-list__table"
          style={{ width: "1200px", minWidth: "100%" }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={() => handleSort(header)}
                    style={{
                      cursor: header.column.getCanSort() ? "pointer" : "default",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort()
                      ? sorting[0] &&
                        sorting[0].id === header.column.id &&
                        (sorting[0].desc ? " 🔽" : " 🔼")
                      : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  No data
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="employee-list__controls employee-list__controls--bottom">
        <p>
          Showing entries {startEntry} - {endEntry} out of a total of {filteredData.length}
        </p>
        <div className="employee-list__pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
              aria-label={`Go to page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <button onClick={clearAllData} className="employee-list__clear-button">
        Clear All Data
      </button>
    </div>
  );
}

export default EmployeeList;
