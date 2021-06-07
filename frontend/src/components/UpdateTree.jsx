import React, { useEffect, useState } from "react";
import VernacularNameDB from "./VernacularNameDB";
function UpdateTree(props) {
  const {
    showUpdateTreeModal,
    updateData,
    newTreeData,
    vernacularNames,
    onShowModalChange,
    newVernacularNameFromVernacularNameDB,
    updateVernacularNameFromVernacularNameDB,
    deleteVernacularNameFromVernacularNameDB,
  } = props;
  const [scientific_name, setScientificName] = useState(
    updateData.scientific_name
  );
  const [primary_name, setPrimaryName] = useState(updateData.primary_name);
  const [componentVernacularNames, setComponentVernacularNames] = useState(
    updateData.vernacular_names
  );
  const [
    showVernacularNameDBOperationsArea,
    setShowVernacularNameDBOperationsArea,
  ] = useState(false);
  return (
    <div
      className={`${showUpdateTreeModal} modal absolute z-100 inset-0 h-screen flex  justify-center items-center bg-gray-300 bg-opacity-20`}
    >
      <div className="card bg-darkblue space-y-8 rounded-lg px-4 py-4 flex flex-col h-5/6 overflow-auto">
        <div className="scientific-name flex flex-col py-2">
          <div className="py-2 text-white">
            <label>Scientific Name</label>
          </div>
          <div>
            <input
              type="text"
              value={scientific_name}
              className="rounded-lg text-black p-1"
              onChange={(e) => setScientificName(e.target.value)}
            />
          </div>
        </div>
        <div className="primary-name flex flex-col">
          <div className="py-2 text-white">
            <label>Primary Name</label>
          </div>
          <div>
            <input
              value={primary_name}
              type="text"
              className="rounded-lg text-black p-1"
              onChange={(e) => setPrimaryName(e.target.value)}
            />
          </div>
        </div>
        <div className="vernacular-name flex flex-col">
          <div className="py-2 text-white">
            <label>Vernacular Names</label>
          </div>
          <div>
            {componentVernacularNames.map((el, index) => (
              <div className="flex" key={index}>
                <select
                  value={el.vernacular_name}
                  className="flex my-1 mx-2"
                  onChange={(el) => {
                    const chosenIndex = el.target.selectedIndex;
                    const temp = [...componentVernacularNames];
                    console.log("temp: ", temp);
                    temp[index] = vernacularNames[chosenIndex];
                    setComponentVernacularNames([...temp]);
                    console.log(componentVernacularNames);
                  }}
                >
                  {vernacularNames.map((vEl, vIndex) => (
                    <option key={vIndex}>{vEl.vernacular_name}</option>
                  ))}
                </select>
                <button
                  className="delete-button"
                  onClick={() => {
                    console.log("delete");
                    console.log("index: ", index);
                    let tempComponentVernacularNames = [
                      ...componentVernacularNames,
                    ];
                    console.log(tempComponentVernacularNames);
                    tempComponentVernacularNames.splice(index, 1);
                    console.log(tempComponentVernacularNames);
                    setComponentVernacularNames([
                      ...tempComponentVernacularNames,
                    ]);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    className="fill-current text-danger mx-2"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() =>
                setComponentVernacularNames([
                  ...componentVernacularNames,
                  vernacularNames[0],
                ])
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                className="fill-current text-lightgreen"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </button>
          </div>
          <div className="vernacular-name-add py-2">
            <div className="flex">
              <button
                className="text-white"
                onClick={() => {
                  setShowVernacularNameDBOperationsArea(
                    !showVernacularNameDBOperationsArea
                  );
                }}
              >
                Vernacular DB Operations
              </button>
              {showVernacularNameDBOperationsArea ? (
                <svg
                  id="expand-more"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  className="fill-current text-white"
                >
                  <path d="M24 24H0V0h24v24z" fill="none" opacity=".87" />
                  <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
                </svg>
              ) : (
                <svg
                  id="expand-less"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  className="fill-current text-white"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z" />
                </svg>
              )}
            </div>
            {showVernacularNameDBOperationsArea && (
              <VernacularNameDB
                vernacularNames={vernacularNames}
                newVernacularNameFromVernacularNameDB={(ret) => {
                  console.log("newVernacularNameFromVernacularNameDB");
                  console.log(ret);
                  newVernacularNameFromVernacularNameDB(ret);
                }}
                deleteVernacularNameFromVernacularNameDB={(ret) => {
                  console.log("deleteVernacularNameFromVernacularNameDB");
                  console.log(ret);
                  deleteVernacularNameFromVernacularNameDB(ret);
                }}
                updateVernacularNameFromVernacularNameDB={(ret) => {
                  console.log("updateVernacularNameFromVernacularNameDB");
                  updateVernacularNameFromVernacularNameDB(ret);
                }}
              ></VernacularNameDB>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-lightgreen text-white p-2 text-center rounded-lg font-semibold mx-2"
            onClick={() => {
              console.log("UPDATE SEND");
              var toSendObject = {
                id: updateData.id,
                primary_name,
                scientific_name,
              };
              toSendObject["vernacular_names"] = componentVernacularNames;
              console.log("toSendObject", toSendObject);
              newTreeData(toSendObject);
            }}
          >
            Send
          </button>
          <button
            className="bg-danger text-white p-2 text-center rounded-lg font-semibold mx-2"
            onClick={() => {
              onShowModalChange("hidden");
              setComponentVernacularNames([]);
            }}
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
}
export default UpdateTree;
