import React from 'react';

function RecordsPerPageSelect({ recordsPerPage, onChange }) {
  const options = [5, 10, 20, 50];
  return (
    <div className="records">
      <label>Počet záznamů na stránce: </label>
      <select value={recordsPerPage} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RecordsPerPageSelect;
