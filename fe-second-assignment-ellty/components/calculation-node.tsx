"use client";

import { useState } from "react";
import { Calculation, CreateCalculationPayload, OperationType } from "@/types";
import { MessageSquare, Plus, Send, X } from "lucide-react";

interface CalculationNodeProps {
  node: Calculation;
  onReply: (
    data: Omit<CreateCalculationPayload, "username"> & { parentId: string },
  ) => void;
}

export default function CalculationNode({
  node,
  onReply,
}: CalculationNodeProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [operation, setOperation] = useState<OperationType>("ADD");
  const [rightArg, setRightArg] = useState<number>(0);

  const handleSend = () => {
    onReply({
      parentId: node._id,
      operation,
      rightArg,
    });
    setShowReplyForm(false);
    setRightArg(0);
    setOperation("ADD");
  };

  return (
    <div className="ml-2 sm:ml-6 border-l-2 border-blue-100 pl-4 my-4 transition-all">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600">
              {node.username.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-sm text-gray-700">
              @{node.username}
            </span>
          </div>
          <span className="text-[10px] text-gray-400">
            {new Date(node.createdAt).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-50">
          {node.operation !== "START" && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
              {node.operation === "ADD" && "+"}
              {node.operation === "SUBTRACT" && "-"}
              {node.operation === "MULTIPLY" && "×"}
              {node.operation === "DIVIDE" && "÷"}
            </span>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
              {node.operation === "START" ? "Initial Value" : "Input"}
            </span>
            <span className="text-lg font-mono font-bold text-gray-800">
              {node.rightArg}
            </span>
          </div>
          <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
              Result
            </span>
            <span className="text-lg font-mono font-bold text-green-600">
              {node.value}
            </span>
          </div>
        </div>

        
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className={`mt-4 flex items-center gap-1.5 text-xs font-bold transition-colors ${
            showReplyForm ? "text-red-500" : "text-blue-500 hover:text-blue-700"
          }`}
        >
          {showReplyForm ? (
            <>
              {" "}
              <X size={14} /> Cancel{" "}
            </>
          ) : (
            <>
              {" "}
              <MessageSquare size={14} /> Reply{" "}
            </>
          )}
        </button>

        {showReplyForm && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-blue-400 uppercase mb-1 ml-1">
                Method
              </label>
              <select
                className="w-full p-2 bg-white border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={operation}
                onChange={(e) => setOperation(e.target.value as OperationType)}
              >
                <option value="ADD">Add (+)</option>
                <option value="SUBTRACT">Subtract (-)</option>
                <option value="MULTIPLY">Multiply (×)</option>
                <option value="DIVIDE">Divide (÷)</option>
              </select>
            </div>

            <div className="sm:w-32">
              <label className="block text-[10px] font-bold text-blue-400 uppercase mb-1 ml-1">
                Number
              </label>
              <input
                type="number"
                className="w-full p-2 bg-white border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={rightArg}
                onChange={(e) => setRightArg(Number(e.target.value))}
              />
            </div>

            <button
              onClick={handleSend}
              className="self-end bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-all shadow-md active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {node.children && node.children.length > 0 && (
          <div className="space-y-2">
            {node.children.map((child) => (
              <CalculationNode key={child._id} node={child} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
