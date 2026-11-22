import React from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';

export const SizeChartModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sizeTable = [
    { uk: '4', usMen: '4.5', usWomen: '6', eu: '37', cm: '23.5' },
    { uk: '5', usMen: '5.5', usWomen: '7', eu: '38', cm: '24.2' },
    { uk: '6', usMen: '6.5', usWomen: '8', eu: '39.5', cm: '25.0' },
    { uk: '7', usMen: '7.5', usWomen: '9', eu: '41', cm: '25.8' },
    { uk: '8', usMen: '8.5', usWomen: '10', eu: '42.5', cm: '26.7' },
    { uk: '9', usMen: '9.5', usWomen: '11', eu: '44', cm: '27.5' },
    { uk: '10', usMen: '10.5', usWomen: '12', eu: '45', cm: '28.3' },
    { uk: '11', usMen: '11.5', usWomen: '13', eu: '46', cm: '29.2' },
    { uk: '12', usMen: '12.5', usWomen: '14', eu: '47', cm: '30.0' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Shoe Size Conversion Guide</h3>
              <p className="text-xs text-slate-500">Iqra Shoes conforms to Standard UK / India (IND) Foot Sizing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">UK / India (IND)</th>
                  <th className="py-3 px-4">US Men</th>
                  <th className="py-3 px-4">US Women</th>
                  <th className="py-3 px-4">EU / Euro</th>
                  <th className="py-3 px-4">Foot Length (CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {sizeTable.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="py-2.5 px-4 font-bold text-amber-700 text-sm">UK {row.uk}</td>
                    <td className="py-2.5 px-4">{row.usMen}</td>
                    <td className="py-2.5 px-4">{row.usWomen}</td>
                    <td className="py-2.5 px-4">{row.eu}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{row.cm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measuring Instructions */}
          <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100">
            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              How to measure your foot at home:
            </h4>
            <ol className="list-decimal list-inside text-xs text-amber-950/80 space-y-1.5 leading-relaxed">
              <li>Place a plain piece of paper on the floor against a flat wall.</li>
              <li>Step on the paper with your heel lightly pressing against the wall.</li>
              <li>Mark the furthest point of your longest toe with a pencil.</li>
              <li>Measure the distance from the edge of the paper to the mark in centimeters (CM).</li>
              <li>Compare your CM measurement to the table above. If you are between sizes or have wide feet, we recommend choosing 1 size larger.</li>
            </ol>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
