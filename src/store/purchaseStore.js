// src/store/purchaseStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePurchaseStore = create(
  persist(
    (set, get) => ({
      // Invoice header
      invoice: {
        invoice_no: "",
        invoice_date: new Date().toISOString().slice(0, 10),
        store_id: "",
        supplier_id: "",
        created_by: null,
      },

      // Current item being edited / filled
      currentItem: {
        item_id: "",
        batch_no: "",
        expiry_date: "",
        pack_qty: 1,
        qty: "",
        purchase_rate: "",
        mrp: "",
        gst_percent: "",
        discount_percent: "",
        total_amount: 0,
      },

      // Added items
      items: [],

      // --- Invoice handlers ---
      setInvoice: (partial) =>
        set((state) => ({ invoice: { ...state.invoice, ...partial } })),

      // --- Current item handlers ---
      setCurrentItem: (partial) =>
        set((state) => ({ currentItem: { ...state.currentItem, ...partial } })),

      clearCurrentItem: () =>
        set(() => ({
          currentItem: {
            item_id: "",
            batch_no: "",
            expiry_date: "",
            pack_qty: 1,
            qty: "",
            purchase_rate: "",
            mrp: "",
            gst_percent: "",
            discount_percent: "",
            total_amount: 0,
          },
        })),

      // --- Items handlers ---
      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),

      updateItemAt: (index, item) =>
        set((state) => {
          const copy = [...state.items];
          copy[index] = item;
          return { items: copy };
        }),

      removeItemAt: (index) =>
        set((state) => ({ items: state.items.filter((_, i) => i !== index) })),

      clearAll: () =>
        set(() => ({
          invoice: {
            invoice_no: "",
            invoice_date: new Date().toISOString().slice(0, 10),
            store_id: "",
            supplier_id: "",
            created_by: null,
          },
          currentItem: {
            item_id: "",
            batch_no: "",
            expiry_date: "",
            pack_qty: 1,
            qty: "",
            purchase_rate: "",
            mrp: "",
            gst_percent: "",
            discount_percent: "",
            total_amount: 0,
          },
          items: [],
        })),
    }),
    {
      name: "purchase-storage", // localStorage key
      partialize: (state) => ({
        invoice: state.invoice,
        currentItem: state.currentItem,
        items: state.items,
      }),
    }
  )
);
