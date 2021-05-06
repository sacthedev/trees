import React, { useEffect, useState } from "react";

function UpdateTree(props) {
  const {
    showUpdateTreeModal,
    onShowUpdateTreeModalChange,
    currentTreeData,
    newTreeData,
  } = props;

  const [currentFormData, setCurrentFormData] = useState(currentTreeData);

  console.log("UPDATE TREE function");
  console.log(currentTreeData);
  if (showUpdateTreeModal === "hidden") return null;

  function combineOldNewObjects(oldObj, newObj) {
    console.log("combineOldNewObjects");
    console.log("Before combine -> ", oldObj);
    const combinedObject = Object.assign({}, oldObj, newObj);
    console.log("After combine -> ", combinedObject);
    return combinedObject;
  }
  return (
    <div
      className={`${showUpdateTreeModal} modal fixed z-100 inset-0 h-screen flex justify-center items-center bg-gray-300 bg-opacity-5`}
    >
      <div className="card bg-darkblue w-1/3 space-y-4 rounded-lg py-4 opacity-100">
        <div className="scientific-name flex justify-center items-center">
          <div>
            <div className="text-white">
              <label>Scientific Name</label>
            </div>
            <input
              defaultValue={currentTreeData.scientific_name}
              type="text"
              className="rounded-lg text-black"
              onChange={(e) =>
                setCurrentFormData({ scientific_name: e.target.value })
              }
            />
          </div>
        </div>
        <div className="primary-name flex justify-center items-center">
          <div>
            <div className="text-white">
              <label>Primary Name</label>
            </div>
            <input
              defaultValue={currentTreeData.primary_name}
              type="text"
              className="rounded-lg text-black"
              onChange={(e) =>
                setCurrentFormData({ primary_name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-green text-white p-2 text-center rounded-lg font-semibold mx-2"
            onClick={() => {
              console.log("I was clicked to be sent");
              console.log("currentTreeData -> ", currentTreeData);
              console.log("currentFormData -> ", currentFormData);
              //newTreeData(currentFormData);
              newTreeData(
                combineOldNewObjects(currentTreeData, currentFormData)
              );
            }}
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
