import React from 'react';
// import { calculateItemAmount } from './calculations'; 

// Props: item (object), updateItem (callback), index (number), itemsMaster (array)
const BillRowInput = ({ item, updateItem, index, itemsMaster }) => {
    const calc = []
    
    // Helper function for input change
    const handleChange = (field, value) => {
        // Automatically convert numeric fields
        const numericValue = ['qty', 'mrp', 'purchaseRate', 'salesDiscountPercent', 'freeQty', 
                              'purchaseDiscountPercent', 'purchaseDiscountAmount', 'schemePercent', 'schemeAmount']
            .includes(field) ? parseFloat(value) || 0 : value;
            
        updateItem(index, field, numericValue);
    };

    return (
        <tr className="hover:bg-gray-50 text-xs">
            {/* 1. SI (Sticky) */}
            <td className="px-1 py-1 text-center font-medium sticky left-0 z-10 bg-white">{index + 1}</td>
            
            {/* 2. Name (Sticky) */}
            <td className="px-1 py-1 sticky left-[25px] z-10 bg-white min-w-[200px]">
                <select
                    value={item.itemId}
                    onChange={(e) => handleChange('itemId', e.target.value)}
                    className="w-full px-1 py-1 text-xs border rounded"
                >
                    <option value="">Select Item...</option>
                    {itemsMaster.map(i => (<option key={i.id} value={i.id}>{i.name}</option>))}
                </select>
            </td>

            {/* --- CORE INPUTS (3-7) --- */}
            <td className="px-1 py-1 min-w-[60px]"><input type="number" value={item.qty || ''} onChange={(e) => handleChange('qty', e.target.value)} className="w-full px-1 py-1 text-right border rounded" /></td>
            <td className="px-1 py-1 min-w-[70px]"><input type="number" value={item.mrp || ''} onChange={(e) => handleChange('mrp', e.target.value)} className="w-full px-1 py-1 text-right border rounded" step="0.01" /></td>
            <td className="px-1 py-1 min-w-[70px]"><input type="number" value={item.purchaseRate || ''} onChange={(e) => handleChange('purchaseRate', e.target.value)} className="w-full px-1 py-1 text-right border rounded" step="0.01" /></td>
            <td className="px-1 py-1 min-w-[50px]"><input type="number" value={item.salesDiscountPercent || 0} onChange={(e) => handleChange('salesDiscountPercent', e.target.value)} className="w-full px-1 py-1 text-right border rounded" min="0" max="100" step="0.01" /></td>
            <td className="px-1 py-1 min-w-[50px]"><input type="number" value={item.freeQty || 0} onChange={(e) => handleChange('freeQty', e.target.value)} className="w-full px-1 py-1 text-right border rounded" min="0" /></td>

            {/* --- INVENTORY/MASTER DATA (8-11) --- */}
            <td className="px-1 py-1 min-w-[70px]"><input type="text" value={item.batchNo} onChange={(e) => handleChange('batchNo', e.target.value)} className="w-full px-1 py-1 border rounded" /></td>
            <td className="px-1 py-1 min-w-[70px]"><input type="month" value={item.expiryDate} onChange={(e) => handleChange('expiryDate', e.target.value)} className="w-full px-1 py-1 border rounded" /></td>
            <td className="px-1 py-1 text-center min-w-[60px] text-gray-600">{item.hsn || '-'}</td>
            <td className="px-1 py-1 text-center min-w-[60px] text-gray-600">{item.packSize || '-'}</td>

            {/* --- PURCHASE DISCOUNTS (12-14) --- */}
            <td className="px-1 py-1 min-w-[60px]">
                <select value={item.discountType} onChange={(e) => handleChange('discountType', e.target.value)} className="w-full px-1 py-1 border rounded">
                    <option value="P">%</option><option value="A">Amt</option>
                </select>
            </td>
            <td className="px-1 py-1 min-w-[60px]">
                <input type="number" value={item.purchaseDiscountPercent || 0} onChange={(e) => handleChange('purchaseDiscountPercent', e.target.value)} disabled={item.discountType === 'A'} className="w-full px-1 py-1 text-right border rounded disabled:bg-gray-100" step="0.01" />
            </td>
            <td className="px-1 py-1 min-w-[60px]">
                <input type="number" value={item.purchaseDiscountAmount || 0} onChange={(e) => handleChange('purchaseDiscountAmount', e.target.value)} disabled={item.discountType === 'P'} className="w-full px-1 py-1 text-right border rounded disabled:bg-gray-100" step="0.01" />
            </td>

            {/* --- SCHEME DISCOUNTS (15-17) --- */}
            <td className="px-1 py-1 min-w-[60px]">
                <select value={item.schemeType} onChange={(e) => handleChange('schemeType', e.target.value)} className="w-full px-1 py-1 border rounded">
                    <option value="P">%</option><option value="A">Amt</option>
                </select>
            </td>
            <td className="px-1 py-1 min-w-[60px]">
                <input type="number" value={item.schemePercent || 0} onChange={(e) => handleChange('schemePercent', e.target.value)} disabled={item.schemeType === 'A'} className="w-full px-1 py-1 text-right border rounded disabled:bg-gray-100" step="0.01" />
            </td>
            <td className="px-1 py-1 min-w-[60px]">
                <input type="number" value={item.schemeAmount || 0} onChange={(e) => handleChange('schemeAmount', e.target.value)} disabled={item.schemeType === 'P'} className="w-full px-1 py-1 text-right border rounded disabled:bg-gray-100" step="0.01" />
            </td>

            {/* --- TAX & TOTALS (Read-Only) (18-22) --- */}
            <td className="px-1 py-1 text-right min-w-[50px]">{item.gstPercent}%</td>
            <td className="px-1 py-1 text-right min-w-[70px] font-medium text-gray-700">₹{calc.taxableValue}</td>
            <td className="px-1 py-1 text-right min-w-[50px] text-green-700">₹{calc.cgstAmount}</td>
            <td className="px-1 py-1 text-right min-w-[50px] text-green-700">₹{calc.sgstAmount}</td>
            <td className="px-1 py-1 text-right min-w-[100px] font-bold text-blue-600">₹{calc.totalAmount}</td>
        </tr>
    );
};

export default BillRowInput;