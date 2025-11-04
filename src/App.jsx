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


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/sale" element={<Sales />} />
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
