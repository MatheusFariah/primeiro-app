import React from "react";

interface SelectFieldProps {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  formik: any;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  formik,
}) => {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-semibold text-gray-300 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full h-[48px] px-3 rounded-md bg-gray-800 text-white text-base font-medium border ${
            error ? "border-red-500" : "border-white/10"
          } appearance-none focus:outline-none transition-all duration-300`}
        >
          <option value="">Selecione</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="text-red-500 text-xs mt-1 min-h-[1rem]">
          {error && formik.errors[name]}
        </div>
      </div>
    </div>
  );
};

export default SelectField;
