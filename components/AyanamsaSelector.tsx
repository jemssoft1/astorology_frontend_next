"use client";

import Iconify from "./Iconify";

type Ayanamsa =
  | "RAMAN"
  | "LAHIRI"
  | "KRISHNAMURTI"
  | "YUKTESHWAR"
  | "JN_BHASIN"
  | "FAGAN_BRADLEY";

interface Props {
  selectedAyanamsa: Ayanamsa;
  onAyanamsaChange: (ayanamsa: Ayanamsa) => void;
}

export default function AyanamsaSelector({
  selectedAyanamsa,
  onAyanamsaChange,
}: Props) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Ayanamsa
      </label>
      <div className="flex">
        <span className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
          <Iconify icon="mdi:zodiac-leo" width={20} height={20} />
        </span>
        <select
          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          value={selectedAyanamsa}
          onChange={(e) => onAyanamsaChange(e.target.value as Ayanamsa)}
        >
          <option value="RAMAN">Raman</option>
          <option value="LAHIRI">Lahiri</option>
          <option value="KRISHNAMURTI">Krishnamurti</option>
          <option value="YUKTESHWAR">Yukteshwar</option>
          <option value="JN_BHASIN">J.N. Bhasin</option>
          <option value="FAGAN_BRADLEY">Fagan Bradley</option>
        </select>
      </div>
    </div>
  );
}
