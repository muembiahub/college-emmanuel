import React from "react";

export default function FormInput({ label, name, type = "text", value, onChange, placeholder, required = false, icon: Icon }) {
  return (
    <div className="group">
      <label className="block text-sm font-semibold text-gray-200 mb-3">
        {label} {required && "*"}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
        />
        {Icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 pointer-events-none transition-all duration-200"></div>
      </div>
    </div>
  );
}
