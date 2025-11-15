// src/pages/PurchasePreview.jsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPurchaseById } from "@/services/purchaseApi";


export default function PurchasePreview() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["purchase", id],
    queryFn: () => getPurchaseById(id).then((res) => res.data),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Purchase Invoice Preview</h2>

      <h3>Invoice Details</h3>
      <p><b>Invoice No:</b> {data.invoice_no}</p>
      <p><b>Date:</b> {data.invoice_date}</p>
      <p><b>Store:</b> {data.store_id}</p>
      <p><b>Supplier:</b> {data.supplier_id}</p>

      <h3>Items</h3>
      {data.items.map((x, i) => (
        <p key={i}>
          {x.item_id} — Qty: {x.qty} — Total: {x.total_amount}
        </p>
      ))}

      <h3>Total: {data.net_amount}</h3>
    </div>
  );
}
