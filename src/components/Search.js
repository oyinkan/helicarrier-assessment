import React from "react";

export default function Search({ searchValue, handleSearchValue }) {
  return(
    <>
      <div>
        <input
          type="text"
          className="form-control search"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchValue}
        />
      </div>
    </>
  )
}
