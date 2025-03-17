import Home from './pages/Home.jsx';
import EmployeeList from './pages/EmployeeList.jsx';
import { Routes, Route } from 'react-router-dom';

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
