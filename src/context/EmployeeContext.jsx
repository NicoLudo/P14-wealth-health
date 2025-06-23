import { createContext, useState } from "react";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);

  const addEmployee = employee => setEmployees(e => [...e, employee]);
  const clearEmployees = () => setEmployees([]);

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, clearEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
};
