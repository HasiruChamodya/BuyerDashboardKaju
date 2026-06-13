import { useState } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { CashewGrade, ProcessingType } from "../../types";
import Button from "./Button";

export interface FilterState {
  processingTypes: ProcessingType[];
  grades: CashewGrade[];
  packWeights: string[];
  minPrice: number | "";
  maxPrice: number | "";
  minWeight: number | "";
  vendorRating: number;
  inStockOnly: boolean;
}

export const defaultFilters: FilterState = {
  processingTypes: [],
  grades: [],
  packWeights: [],
  minPrice: "",
  maxPrice: "",
  minWeight: "",
  vendorRating: 0,
  inStockOnly: false,
};

const PROCESSING_TYPES: ProcessingType[] = ["Raw", "Roasted", "Baked", "Flavoured"];
const GRADES: CashewGrade[] = ["W180", "W210", "W240", "W320", "W450", "LWP", "SWP", "Splits"];
const PACK_WEIGHTS = ["5kg", "10kg", "25kg", "50kg", "1MT"];

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-h">{title}</h3>
      {children}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  mono,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  mono?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1 text-sm text-text cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-300"
      />
      <span className={mono ? "mono-num" : ""}>{label}</span>
    </label>
  );
}

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const [open, setOpen] = useState(true);

  function toggle<K extends "processingTypes" | "grades" | "packWeights">(
    key: K,
    value: FilterState[K][number]
  ) {
    const list = filters[key] as string[];
    const next = list.includes(value as string)
      ? list.filter((v) => v !== value)
      : [...list, value as string];
    onChange({ ...filters, [key]: next } as FilterState);
  }

  return (
    <div className="rounded-card border border-border bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-text-h lg:cursor-default"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" />
          Filter Lots
        </span>
        <span className="lg:hidden text-xs text-brand-600">{open ? "Hide" : "Show"}</span>
      </button>

      <div className={`${open ? "block" : "hidden lg:block"} px-4 pb-2`}>
        <FilterSection title="Processing Type">
          {PROCESSING_TYPES.map((t) => (
            <CheckboxRow
              key={t}
              label={t}
              checked={filters.processingTypes.includes(t)}
              onChange={() => toggle("processingTypes", t)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Grade Classification">
          <div className="grid grid-cols-2 gap-x-2">
            {GRADES.map((g) => (
              <CheckboxRow
                key={g}
                label={g}
                mono
                checked={filters.grades.includes(g)}
                onChange={() => toggle("grades", g)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Pack Weight">
          {PACK_WEIGHTS.map((w) => (
            <CheckboxRow
              key={w}
              label={w}
              mono
              checked={filters.packWeights.includes(w)}
              onChange={() => toggle("packWeights", w)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Price Band (LKR / MT)">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value === "" ? "" : Number(e.target.value) })}
              className="w-full rounded-md border border-border px-2.5 py-1.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <span className="text-text">–</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value === "" ? "" : Number(e.target.value) })}
              className="w-full rounded-md border border-border px-2.5 py-1.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </FilterSection>

        <FilterSection title="Total Weight Available (MT)">
          <input
            type="number"
            placeholder="Minimum MT"
            value={filters.minWeight}
            onChange={(e) => onChange({ ...filters, minWeight: e.target.value === "" ? "" : Number(e.target.value) })}
            className="w-full rounded-md border border-border px-2.5 py-1.5 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </FilterSection>

        <FilterSection title="Vendor Rating">
          <div className="flex gap-2">
            {[0, 3, 4, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => onChange({ ...filters, vendorRating: r })}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                  filters.vendorRating === r
                    ? "border-brand-600 bg-brand-50 text-brand-600"
                    : "border-border text-text hover:bg-bg-soft"
                }`}
              >
                {r === 0 ? "Any" : `${r}+`}
              </button>
            ))}
          </div>
        </FilterSection>

        <div className="py-4">
          <CheckboxRow
            label="In stock only"
            checked={filters.inStockOnly}
            onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          fullWidth
          icon={<RotateCcw className="h-3.5 w-3.5" />}
          onClick={() => onChange(defaultFilters)}
        >
          Reset filters
        </Button>
      </div>
    </div>
  );
}
