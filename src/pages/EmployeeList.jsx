import { useState, useRef, useEffect, useMemo, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/css/tabulator.min.css";
import "../assets/scss/pages/employee-list.scss";
import { EmployeeContext } from "../context/EmployeeContext";
import useEmployeeFilter from "../hooks/useEmployeeFilter";
import usePagination from "../hooks/usePagination";

// Define table columns
const columns = [
  { title: "First Name", field: "firstName", headerSort: false },
  { title: "Last Name", field: "lastName", headerSort: false },
  { title: "Start Date", field: "startDate" },
  { title: "Department", field: "department" },
  { title: "Date of Birth", field: "dateOfBirth" },
  { title: "Street", field: "street", headerSort: false },
  { title: "City", field: "city" },
  { title: "State", field: "state" },
  { title: "Zip Code", field: "zipCode" }
];

// Sample employee data
// const employees = [
//   { firstName: "John", lastName: "Doe", startDate: "2023-01-10", department: "Sales", dateOfBirth: "1990-06-15", street: "123 Main St", city: "Los Angeles", state: "CA", zipCode: "90001" },
//   { firstName: "Jane", lastName: "Smith", startDate: "2022-11-20", department: "Marketing", dateOfBirth: "1985-09-25", street: "456 Elm St", city: "New York", state: "NY", zipCode: "10001" },
//   { firstName: "Mike", lastName: "Johnson", startDate: "2021-05-30", department: "Engineering", dateOfBirth: "1975-03-10", street: "789 Oak St", city: "Chicago", state: "IL", zipCode: "60601" },
//   { firstName: "Lisa", lastName: "Brown", startDate: "2023-03-05", department: "Human Resources", dateOfBirth: "1995-12-20", street: "101 Pine St", city: "Miami", state: "FL", zipCode: "33101" },
//   { firstName: "Chris", lastName: "Lee", startDate: "2022-09-15", department: "Legal", dateOfBirth: "1980-08-30", street: "202 Cedar St", city: "Dallas", state: "TX", zipCode: "75201" },
//   { firstName: "Sarah", lastName: "Clark", startDate: "2021-07-25", department: "Sales", dateOfBirth: "1970-04-05", street: "303 Birch St", city: "Phoenix", state: "AZ", zipCode: "85001" },
//   { firstName: "Kevin", lastName: "Hall", startDate: "2023-02-10", department: "Marketing", dateOfBirth: "1992-11-15", street: "404 Maple St", city: "San Francisco", state: "CA", zipCode: "94101" },
//   { firstName: "Amanda", lastName: "Young", startDate: "2022-12-20", department: "Engineering", dateOfBirth: "1988-10-25", street: "505 Walnut St", city: "Seattle", state: "WA", zipCode: "98101" },
//   { firstName: "Tom", lastName: "King", startDate: "2021-06-30", department: "Human Resources", dateOfBirth: "1978-03-10", street: "606 Pine St", city: "Denver", state: "CO", zipCode: "80201" },
//   { firstName: "Laura", lastName: "Evans", startDate: "2023-04-05", department: "Legal", dateOfBirth: "1997-12-20", street: "707 Cedar St", city: "Houston", state: "TX", zipCode: "77201" }
// ];

function EmployeeList() {
  const { employees, clearEmployees } = useContext(EmployeeContext);
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const tableRef = useRef(null);

  // Filtered and paginated data
  const filteredData = useEmployeeFilter(employees, searchTerm, sortField, sortOrder);
  const { paginatedData, totalPages, startEntry, endEntry } = usePagination(filteredData, pageSize, currentPage);

  // Update table data on changes
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.replaceData(paginatedData);
      tableRef.current.table.setPageSize(pageSize);
      tableRef.current.table.setPage(currentPage);
    }
  }, [paginatedData, pageSize, currentPage, employees]);

  // Handlers for search, page size, page change, and sorting
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);
  const handlePageSizeChange = useCallback((e) => {
    setPageSize(Number(e.target.value));
  }, []);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  const handleSort = useCallback((sorter) => {
    setSortField(sorter.field);
    setSortOrder(sorter.dir);
  }, []);

  const clearAllData = () => {
    clearEmployees();
    if (tableRef.current) {
      tableRef.current.replaceData([]);
    }
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="employee-list">
      <h1 className="employee-list__title" aria-label="Current Employees">Current Employees</h1>
      <Link to="/" className="employee-list__link" title="Go back to Home">Home</Link>

      <div className="employee-list__controls">
        <label htmlFor="pageSize">
          Show 
          <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} aria-label="Number of entries per page">
            {[5, 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          entries
        </label>
        <label htmlFor="search">
          Search:
          <input id="search" type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search employees..." aria-label="Search for an employee"/>
        </label>
      </div>

      <ReactTabulator
        ref={tableRef}
        columns={columns}
        data={paginatedData}
        layout="fitColumns"
        pagination
        paginationMode="local"
        paginationSize={pageSize}
        paginationSizeSelector={[5, 10, 25, 50, 100]}
        paginationCounter="rows"
        tooltips
        aria-live="polite"
        style={{ width: "1200px" }}
        dataSorted={handleSort}
      />

      <div className="employee-list__controls employee-list__controls--bottom">
        <p>
          Showing entries {startEntry} - {endEntry} out of a total of {filteredData.length}
        </p>
        <div className="employee-list__pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index + 1} onClick={() => handlePageChange(index + 1)} disabled={currentPage === index + 1} aria-label={`Go to page ${index + 1}`}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <button onClick={clearAllData} className="employee-list__clear-button">Clear All Data</button>
    </div>
  );
}

export default EmployeeList;
