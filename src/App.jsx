import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import User from "./pages/user";
import PurchaseReport from "./pages/report/PurchaseReport";
import SalesReport from "./pages/report/SalesReport";
import PurchaseReturnReport from "./pages/report/PurchaseReturnReport";
import SalesReturnReport from "./pages/report/SalesReturnReport";
import PurchaseBillEntry from "./pages/store_stock";
import GstSalesReport from "./pages/tax_reports/Gst_Sales_Report";
import GstPurchaseReport from "./pages/tax_reports/Gst_Purchase_Report";
import ItemWiseSalesReport from "./pages/sales_reports/Item_Wise_Sales_Report";
import MrpVsSalesPriceReport from "./pages/sales_reports/Mrp_Vs_Sales_Rate_Report";
import ProfitReport from "./pages/sales_reports/Profit_Report";
import CurrentStockReport from "./pages/inventory_reports/Current_Stock";
import OutOffStockReport from "./pages/inventory_reports/OutOff_Stock";







function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/staff" element={< User />} />
          <Route path="/store" element={< StoreMockApiHeader />} />
          <Route path="/hsn" element={< HsnMockApiHeader />} />
          <Route path="/drug" element={< DrugScheduleMockApiHeader />} />
          <Route path="/items" element={< ItemMockApiHeader />} />
          <Route path="/supplier" element={< SupplierMockApiHeader />} />


          <Route path="/customers" element={< CustomerMockApiHeader />} />


          <Route path="/purchase/purchaceinvoice" element={<PurchaseInvoiceMockApiHeader />} />
          <Route path="/purchase/purchaceitem" element={<PurchaseItemMockApiHeader />} />
          <Route path="/purchase/addpurchase" element={<AddPurchaseForm />} />
          <Route path="/purchase/report" element={<PurchaseReport />} />

          <Route path="/stock" element={<StockMockApiHeader />} />

          <Route path="/return" element={<PurchaseReturnMockApiHeader />} />
          <Route path="/return/addpurchasereturn" element={<PurchaseReturnForm />} />
          <Route path="/purchase/purchacereturn" element={<PurchaseReturnMockApiHeader />} />
          <Route path="/return/returnitem" element={<PurchaseREturnItemMockApiHeader />} />
          <Route path="/return/report" element={<PurchaseReturnReport />} />

          <Route path="/sales/add" element={<SalesForm />} />
          <Route path="/sales/list" element={<SalesInvoiceMockApiHeader />} />
          <Route path="/sales/items" element={<SalesItemMockApiHeader />} />
          <Route path="/sales/report" element={<SalesReport />} />


          <Route path="/salesreturn/add" element={<AddSalesReturnForm />} />
          <Route path="/salesreturn/list" element={< SalesReturnMockApiHeader />} />
          <Route path="/salesreturn/items" element={< SalesReturnItemMockApiHeader />} />
          <Route path="/salesreturn/report" element={<SalesReturnReport />} />


          <Route path="/damaged/add" element={< AddDamagedStockForm />} />
          <Route path="/damaged/list" element={< DamagedStockMockApiHeader />} />


          <Route path="/excess/add" element={< AddExcessStockForm />} />
          <Route path="/excess/list" element={< ExcessStockMockApiHeader />} />
          <Route path="/purchase" element={<PurchaseBillEntry />} />


          <Route path="/gst/sales" element={<GstSalesReport />} />
          <Route path="/gst/purchase" element={<GstPurchaseReport />} />

          <Route path="/sale-report/item-wise" element={<ItemWiseSalesReport />} />
          <Route path="/sale-report/mrp-salesprice" element={<MrpVsSalesPriceReport />} />
          <Route path="/sale-report/profit" element={<ProfitReport />} />



 <Route path="/stock/current-stock" element={<CurrentStockReport />} />
 <Route path="/stock/outoff-stock" element={<OutOffStockReport />} />






        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}          // default auto close time
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick               // click to close
        rtl={false}
        pauseOnFocusLoss           // ⬅ pause when window/tab loses focus
        draggable                  // ⬅ allow drag & close
        pauseOnHover               // ⬅ pause when mouse over toast
        theme="colored"            // "light" | "dark" | "colored"
      />
    </BrowserRouter>

  );
}

export default App;
