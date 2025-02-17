import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Import UI components
import { Table } from "lucide-react"; // Import the Table icon from lucide-react


interface TableNumberInputProps {
  tableNumber: string; // Prop for table number value
  setTableNumber: React.Dispatch<React.SetStateAction<string>>; // Prop for updating the table number
}

const TableNumberInput: React.FC<TableNumberInputProps> = ({ tableNumber, setTableNumber }) => {
  const [error, setError] = useState<string>(""); // Error state for validation

  // Handle the table number input change
  const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTableNumber(value); // Update the table number state

    // Validate the table number input
    if (value.trim() === "") {
      setError("Table number is required");
    } else if (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 50) {
      setError("Please enter a valid table number (1-50)");
    } else {
      setError(""); // Clear the error if the input is valid
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Table className="h-6 w-6 text-red-500" /> {/* Table icon */}
          <div>
            <CardTitle>Table Number</CardTitle>
            <CardDescription>Please enter your table number</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table number input field */}
        <input
          type="number"
          value={tableNumber} // The value is controlled by the parent component
          onChange={handleTableNumberChange} // Update table number when the input changes
          className="w-full h-12 border-2 p-2 rounded-lg"
          placeholder="Enter table number (1-50)"
        />
        {/* Display error message if there's an invalid input */}
        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
      </CardContent>
    </Card>
  );
};

export default TableNumberInput;
