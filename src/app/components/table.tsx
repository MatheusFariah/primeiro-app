// components/Table.tsx
import React from "react";

interface TableProps {
  children: React.ReactNode;
}

const Table = ({ children }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed text-base text-left border-collapse divide-y divide-gray-700">
        {children}
      </table>
    </div>
  );
};

export default Table;
