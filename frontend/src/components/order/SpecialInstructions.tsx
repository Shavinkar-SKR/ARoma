import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const SpecialInstructions: React.FC = () => {
  const [instructions, setInstructions] = useState<string>("");

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-xl font-bold mb-4">Special Instructions</h2>
      <Textarea
        placeholder="Add dietary preferences or special instructions..."
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="resize-none"
      />
    </div>
  );
};

export default SpecialInstructions;
