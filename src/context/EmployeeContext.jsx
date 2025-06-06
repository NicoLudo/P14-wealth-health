import { createContext, useEffect, useState } from "react";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const stored = localStorage.getItem("employees");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (employee) => {
    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
  };

  const clearEmployees = () => {
    setEmployees([]);
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, clearEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
};
