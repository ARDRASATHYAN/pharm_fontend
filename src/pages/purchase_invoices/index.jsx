import React from "react";
import BasicTable from "@/components/commen/BasicTable";
import { usepurchaseinvoice } from "@/hooks/usePurchaseInvoice";
import { getPurchaseInvoiceColumns } from "./components/PurchaseInvoicesHeader";

export default function AllPurchaseInvoices() {
const { data: purchaseinvoiceResponse = {}, isLoading, isFetching } = usepurchaseinvoice();
const purchaseinvoice = purchaseinvoiceResponse.data || []; // <-- important


  return (
    <div>
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        All Purchase Invoices
      </h2>

      <BasicTable
        columns={getPurchaseInvoiceColumns()}
        data={purchaseinvoice}
        loading={isLoading}
      />
    </div>
  );
}
