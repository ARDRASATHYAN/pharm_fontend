import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/customer/Customers";
import Purchases from "./pages/Purchases";
import Reports from "./pages/Reports";
import Medicines from "./pages/medicine/Medicines";
import Sales from "./pages/sales/Sales";
import BasicTabs from "./pages/sales/components/Tab";
import MedicineForm from "./pages/medicine/MedicineForm";
import CategoryPage from "./pages/medicine/category/CategoryPage";
import UserMockApiHeader from "./pages/user";
import StoreMockApiHeader from "./pages/store";
import HsnMockApiHeader from "./pages/hsn";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medicines/stock" element={<Medicines />} />
          <Route path="/medicines/add" element={<MedicineForm />} />
          <Route path="/medicines/categories" element={<CategoryPage />} />
          <Route path="/staff/add" element={< UserMockApiHeader/>} />
          <Route path="/store/add" element={< StoreMockApiHeader/>} />
            <Route path="/hsn/add" element={< HsnMockApiHeader/>} />
          <Route path="/sales" element={<BasicTabs />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
