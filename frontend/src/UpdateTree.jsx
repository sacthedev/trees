import React, { useEffect, useState } from "react";

function UpdateTree(props) {
  const {
    showUpdateTreeModal,
    onShowUpdateTreeModalChange,
    currentTreeData,
  } = props;
  const [scientific_name, setScientificName] = useState(
    currentTreeData.scientific_name
  );
  const [common_name, setCommonName] = useState(
          currentTreeData.common_name
  );
  console.log("UPDATE TREE function");
  console.log(currentTreeData);
  return (
    <div
      className={`${showUpdateTreeModal} modal fixed z-100 inset-0 h-screen flex justify-center items-center bg-gray-300 bg-opacity-5`}
    >
      <div className="card bg-darkblue w-1/3 space-y-4 rounded-lg py-4 opacity-100">
        <div className="scientific-name flex justify-center items-center">
          <div>
            <div>
              <label>Scientific Name</label>
            </div>
            <input
              type="text"
              className="rounded-lg text-black"
              onChange={(e) => setScientificName(e.target.value)}
              value={scientific_name}
            />
          </div>
        </div>
        <div className="common-name flex justify-center items-center">
          <div>
            <div>
              <label>Common Name</label>
            </div>
            <input
              type="text"
              className="rounded-lg text-black"
              onChange={(e) => setCommonName(e.target.value)}
              value={common_name}
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-green text-white p-2 text-center rounded-lg font-semibold mx-2"
            onClick={() => newTreeData({ common_name, scientific_name })}
          >
            Send
          </button>

          <button
            className="bg-pink text-white p-2 text-center rounded-lg font-semibold mx-2"
            onClick={() => onShowUpdateTreeModalChange("hidden")}
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
}
export default UpdateTree;
