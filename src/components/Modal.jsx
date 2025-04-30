import React from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className=" bg-[#1f2937] border border-[#2f3f4f] rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#2f3f4f]">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black text-2xl leading-none">
            <FiX />
          </button>
        </div>
        <div className="overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
