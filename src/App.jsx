import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import EmployeeList from "./pages/EmployeeList.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employee-list" element={<EmployeeList />} />
      </Routes>
    </>
  );
}

export default App;
