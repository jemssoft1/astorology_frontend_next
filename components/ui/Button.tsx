import React from "react";
import Iconify from "../Iconify";

interface ButtonProps {
  handleCalculate: () => void;
  isCalculating: boolean;
  selectedPerson: unknown; // adjust type if you know the exact shape
  loadingProgress?: number;
  buttonName?: string;
}

const Button: React.FC<ButtonProps> = ({
  handleCalculate,
  isCalculating,
  selectedPerson,
  loadingProgress,
  buttonName = "Calculate",
}) => {
  return (
    <button
      onClick={handleCalculate}
      disabled={isCalculating || !selectedPerson}
      className={`
        w-full px-6 py-3 rounded-lg text-white font-medium shadow-sm transition-all
        flex items-center justify-center gap-2
        ${
          isCalculating || !selectedPerson
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        }
      `}
    >
      {isCalculating ? (
        <>
          <Iconify
            icon="eos-icons:loading"
            className="animate-spin"
            width={20}
          />
          {buttonName}... {loadingProgress}%
        </>
      ) : (
        <>
          <Iconify icon="akar-icons:thunder" width={20} />
          {buttonName}
        </>
      )}
    </button>
  );
};

export default Button;
