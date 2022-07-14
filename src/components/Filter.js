import React from "react";

export default function DynamicFilter({ optionsData, onSelectChange }) {
  let options = optionsData.map((data) =>
    <option 
      key={data.id}
      value={data.id}
    >
      {data.name}
    </option>
  );

  const handleChange = (e) => {
    let selectedValue = e.target.value;
    onSelectChange(selectedValue);
  }

  return(
    <>
      <select 
        name="customFilter"
        className="form-control"
        onChange={handleChange}
      >
        <option value="">Select Item</option>
        {options}
      </select>
    </>
  )
}