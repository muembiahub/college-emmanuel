import React from "react";

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  placeholder = "Sélectionner",
}) {
  return (
    <div className="group">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-200 mb-3">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {/* Select */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full rounded-xl px-4 py-3 transition-all duration-200
          border border-white/20 backdrop-blur-xl
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          appearance-none
          ${
            disabled
              ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
              : "bg-white/5 text-white hover:bg-white/10 hover:border-white/30 cursor-pointer"
          }
        `}
      >
        {/* Placeholder */}
        <option value="" className="bg-slate-900 text-gray-400">
          {placeholder}
        </option>

        {/* Options dynamiques */}
        {options.length > 0 ? (
          options.map((option) => (
            <option
              key={option.id}
              value={option.id}
              className="bg-slate-900 text-white"
            >
              {option.label}
            </option>
          ))
        ) : (
          <option disabled value="" className="bg-slate-900 text-gray-500">
            Aucune donnée disponible
          </option>
        )}
      </select>
    </div>
  );
}
