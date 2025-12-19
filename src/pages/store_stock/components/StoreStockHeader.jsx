import React from 'react';

// Props: totals (object containing totalTaxableValue, totalGst, totalDiscount, netAmount)
const TotalsSummary = ({ totals }) => {
    return (
        <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-end">
                <div className="w-96">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-gray-700">
                            <span className="font-medium">Total Taxable Value:</span>
                            <span className="text-lg">₹{totals.totalTaxableValue}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-700">
                            <span className="font-medium">Total Discount:</span>
                            <span className="text-lg text-red-600">- ₹{totals.totalDiscount}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-700">
                            <span className="font-medium">Total GST:</span>
                            <span className="text-lg text-green-600">+ ₹{totals.totalGst}</span>
                        </div>
                        <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-800">Net Payable Amount:</span>
                            <span className="text-2xl font-bold text-blue-600">₹{totals.netAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalsSummary;