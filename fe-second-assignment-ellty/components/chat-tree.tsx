"use client";

import { useState } from "react";
import { buildTree } from "@/lib/utils";
import { PlusCircle, Calculator, ChevronRight } from "lucide-react";
import { CreateCalculationPayload } from "@/types";
import { useCalculations } from "@/hooks/use-calculation";
import CalculationNode from "./calculation-node";

export default function ChatTree({ user }: { user: string | null }) {
  const { calculations, isLoading, addCalculation } = useCalculations();
  const [startNum, setStartNum] = useState<number>(0);
  const [isExpanding, setIsExpanding] = useState(false);

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse text-gray-400">
        Loading math trees...
      </div>
    );

  const treeData = buildTree(calculations || []);

  const handleCreateRoot = () => {
    if (!user) return alert("Please login to start a discussion!");

    addCalculation({
      operation: "START",
      rightArg: startNum,
      username: user,
    });

    setStartNum(0);
    setIsExpanding(false);
  };

  const handleReply = (data: Omit<CreateCalculationPayload, "username">) => {
    if (!user) return alert("Please login to reply!");
    addCalculation({ ...data, username: user });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {user && (
        <div className="mb-10 group">
          {!isExpanding ? (
            <button
              onClick={() => setIsExpanding(true)}
              className="w-full py-4 px-6 bg-white border-2 border-dashed border-blue-200 rounded-2xl flex items-center justify-between text-blue-500 hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <PlusCircle size={24} />
                <span className="font-bold">
                  Start a new Math Discussion...
                </span>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </button>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="text-blue-600" size={20} />
                <h2 className="font-bold text-gray-800">
                  New Calculation Tree
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                    Initial Number (Starting Point)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-black font-mono text-lg"
                      placeholder="e.g. 100"
                      value={startNum}
                      onChange={(e) => setStartNum(Number(e.target.value))}
                    />
                    <button
                      onClick={handleCreateRoot}
                      className="bg-blue-600 text-white px-8 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setIsExpanding(false)}
                      className="px-4 text-gray-400 hover:text-gray-600 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  *This will create a new root node. Others can then add
                  operations to this number.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-8">
        {treeData.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-300 italic">
              No discussions found. Start one above!
            </p>
          </div>
        ) : (
          treeData.map((root) => (
            <div key={root._id} className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-transparent rounded-full opacity-20 hidden sm:block"></div>
              <CalculationNode node={root} onReply={handleReply} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
