import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UserMockApiHeader from "./pages/user";
import StoreMockApiHeader from "./pages/store";
import HsnMockApiHeader from "./pages/hsn";
import DrugScheduleMockApiHeader from "./pages/drug_schedule";
import Login from "./pages/auth/Login";
import ItemMockApiHeader from "./pages/items";
import SupplierMockApiHeader from "./pages/supplier";
import CustomerMockApiHeader from "./pages/customer";
import StoreStockMockApiHeader from "./pages/store_stock";
import PurchaseInvoiceMockApiHeader from "./pages/purchase_invoices";
import AddPurchase from "./components/commen/AddItemsPage";
import PreviewPurchase from "./components/commen/PreviewItemsPage ";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
         
        <Route element={<Layout />}>
         {/* <Route path="/" element={<AddPurchase />} />
          <Route path="/preview" element={<PreviewPurchase />} /> */}

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/staff" element={< UserMockApiHeader />} />
          <Route path="/store" element={< StoreMockApiHeader />} />
          <Route path="/hsn" element={< HsnMockApiHeader />} />
          <Route path="/drug" element={< DrugScheduleMockApiHeader />} />
          <Route path="/items" element={< ItemMockApiHeader />} />
          <Route path="/supplier" element={< SupplierMockApiHeader />} />
          <Route path="/customers" element={< CustomerMockApiHeader />} />
          <Route path="/stock" element={<StoreStockMockApiHeader />} />
          <Route path="/purchaceinvoice" element={<PurchaseInvoiceMockApiHeader />} />



        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
