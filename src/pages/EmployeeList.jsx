import { useState, useContext, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "../assets/scss/pages/employee-list.scss";
import { EmployeeContext } from "../context/EmployeeContext";
import useEmployeeFilter from "../hooks/useEmployeeFilter";
import usePagination from "../hooks/usePagination";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";

const columns = [
  { header: "First Name", accessorKey: "firstName" },
  { header: "Last Name", accessorKey: "lastName" },
  { header: "Start Date", accessorKey: "startDate" },
  { header: "Department", accessorKey: "department" },
  { header: "Date of Birth", accessorKey: "dateOfBirth" },
  { header: "Street", accessorKey: "street" },
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

  const filtered = useEmployeeFilter(employees, searchTerm);
  const { paginatedData, totalPages, startEntry, endEntry } = usePagination(filtered, pageSize, currentPage);

  const cols = useMemo(
    () =>
      columns.map(({ header, accessorKey }) => ({
        header,
        accessorKey,
        enableSorting: !["firstName", "lastName", "street"].includes(accessorKey),
      })),
    []
  );

  const table = useReactTable({
    data: paginatedData,
    columns: cols,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  const setSearch = useCallback(e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const setSize = useCallback(e => {
    setPageSize(+e.target.value);
    setCurrentPage(1);
  }, []);

  const setPage = useCallback(p => setCurrentPage(p), []);

  const sort = useCallback(
    header => {
      if (!header.column.getCanSort()) return;
      setSorting(old => {
        const s = old[0];
        const id = header.column.id;
        return [{ id, desc: s && s.id === id && !s.desc }];
      });
    },
    []
  );

  const clearAll = () => {
    clearEmployees();
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="employee-list">
      <h1 className="employee-list__title" aria-label="Current Employees">Current Employees</h1>
      <Link to="/" className="employee-list__link" title="Go back to Home">Home</Link>
      <div className="employee-list__controls">
        <label>
          Show
          <select value={pageSize} onChange={setSize} aria-label="Number of entries per page">
            {[5, 10, 25, 50, 100].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          entries
        </label>
        <label>
          Search:
          <input type="text" value={searchTerm} onChange={setSearch} placeholder="Search employees..." aria-label="Search for an employee" />
        </label>
      </div>
      <div aria-label="Liste des employés">
        <table className="employee-list__table">
          <thead>
            {table.getHeaderGroups().map(g => (
              <tr key={g.id}>
                {g.headers.map(h => (
                  <th
                    key={h.id}
                    onClick={() => sort(h)}
                    style={{ cursor: h.column.getCanSort() ? "pointer" : "default" }}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getCanSort() && sorting[0]?.id === h.column.id
                      ? sorting[0].desc ? " 🔽" : " 🔼"
                      : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length
              ? table.getRowModel().rows.map(r => (
                  <tr key={r.id}>
                    {r.getVisibleCells().map(c => (
                      <td key={c.id}>
                        {flexRender(c.column.columnDef.cell, c.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan={cols.length} className="employee-list__nodata">No data</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div className="employee-list__controls employee-list__controls--bottom">
        <p>
          Showing entries {startEntry} - {endEntry} out of a total of {filtered.length}
        </p>
        <div className="employee-list__pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              disabled={currentPage === i + 1}
              aria-label={`Go to page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <button onClick={clearAll} className="employee-list__clear-button">Clear All Data</button>
    </div>
  );
}

export default EmployeeList;
