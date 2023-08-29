import React from "react";

function SelectFilter({items, label, handleChange}) {
    const onChangeSelect = (e) => {
        const value = e.target.value;
        handleChange(value);
        console.log(value);
    }
  return (
    <>
      <div className="d-flex m-2">
        <label className="col-form-label-sm fw-semibold text-nowrap __bee-text">
          {label}
        </label>
        <select
          className="form-select form-select-sm border-0 fw-semibold text-center"
          onChange={(event) => onChangeSelect(event)}
        >
            <option value={''}>-- Chọn --</option>
          {items.map((option) => (
            <option value={option.id}>{option.name}</option>
          ))}
        </select>
      </div>
    </>
  );
}

export default SelectFilter;
