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
import PurchaseInvoiceMockApiHeader from "./pages/purchase_invoices";
import PurchaseItemMockApiHeader from "./pages/purchaseItem";
import StockMockApiHeader from "./pages/stock";
import PurchaseReturnMockApiHeader from "./pages/purchase_return";
import AddPurchaseForm from "./pages/purchase_invoices/components/AddPurchase";
import PurchaseReturnForm from "./pages/purchase_return/components/PurchaseReturnForm";
import PurchaseREturnItemMockApiHeader from "./pages/purchasereturnitems";
import SalesForm from "./pages/sales_invioces/component/SalesForm";
import AddSalesReturnForm from "./pages/sales_return/components/AddSalesReturnForm";
import SalesInvoiceMockApiHeader from "./pages/sales_invioces";
import SalesItemMockApiHeader from "./pages/salesitems";
import SalesReturnMockApiHeader from "./pages/sales_return";
import SalesReturnItemMockApiHeader from "./pages/salesreturnitem";
import AddDamagedStockForm from "./pages/damanagedstock/components/AddDamagedStock";
import DamagedStockMockApiHeader from "./pages/damanagedstock";
import AddExcessStockForm from "./pages/exceedstock/component/AddExcessFrom";
import ExcessStockMockApiHeader from "./pages/exceedstock";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/staff" element={< UserMockApiHeader />} />
          <Route path="/store" element={< StoreMockApiHeader />} />
          <Route path="/hsn" element={< HsnMockApiHeader />} />
          <Route path="/drug" element={< DrugScheduleMockApiHeader />} />
          <Route path="/items" element={< ItemMockApiHeader />} />
          <Route path="/supplier" element={< SupplierMockApiHeader />} />


          <Route path="/customers" element={< CustomerMockApiHeader />} />


          <Route path="/purchase/purchaceinvoice" element={<PurchaseInvoiceMockApiHeader />} />
          <Route path="/purchase/purchaceitem" element={<PurchaseItemMockApiHeader />} />
          <Route path="/purchase/addpurchase" element={<AddPurchaseForm />} />

          <Route path="/stock" element={<StockMockApiHeader />} />

          <Route path="/return" element={<PurchaseReturnMockApiHeader />} />
          <Route path="/return/addpurchasereturn" element={<PurchaseReturnForm />} />
          <Route path="/purchase/purchacereturn" element={<PurchaseReturnMockApiHeader />} />
          <Route path="/return/returnitem" element={<PurchaseREturnItemMockApiHeader />} />

          <Route path="/sales/add" element={<SalesForm />} />
          <Route path="/sales/list" element={<SalesInvoiceMockApiHeader />} />
          <Route path="/sales/items" element={<SalesItemMockApiHeader />} />


          <Route path="/salesreturn/add" element={<AddSalesReturnForm />} />
          <Route path="/salesreturn/list" element={< SalesReturnMockApiHeader />} />
          <Route path="/salesreturn/items" element={< SalesReturnItemMockApiHeader />} />


          <Route path="/damaged/add" element={< AddDamagedStockForm />} />
          <Route path="/damaged/list" element={< DamagedStockMockApiHeader />} />


          <Route path="/excess/add" element={< AddExcessStockForm />} />
          <Route path="/excess/list" element={< ExcessStockMockApiHeader />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
