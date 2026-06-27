import React from "react";
import data from "../assets/data.json";

const LanguagesSelect = () => {
  return (
    <>
      {Object.keys(data.languages).map((key) => (
        <option
          key={key}
          value={key}
          style={{ backgroundColor: "#0d4ea8", color: "#ffffff" }}
        >
          {data.languages[key]}
        </option>
      ))}
    </>
  );
};

export default LanguagesSelect;
