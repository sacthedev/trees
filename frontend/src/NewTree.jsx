import React, { useState } from "react";

function NewTree(props) {
  const { showModal, onShowModalChange, newTreeData, vernacularNames } = props;
  const [scientific_name, setScientificName] = useState(0);
  const [primary_name, setPrimaryName] = useState(0);
  const [componentVernacularNames, setComponentVernacularNames] = useState([]);
  const [showNewVernacularNameInput, setshowNewVernacularNameInput] = useState(
    false
  );
  return (
    <div
      className={`${showModal} modal absolute z-100 inset-0 h-screen flex justify-center items-center bg-gray-300 bg-opacity-20`}
    >
      <div className="card bg-darkblue space-y-8 rounded-lg px-4 py-4 flex flex-col">
        <div className="scientific-name flex flex-col py-2">
          <div className="py-2 text-white">
            <label>Scientific Name</label>
          </div>
          <div>
            <input
              type="text"
              value={scientific_name}
              className="rounded-lg text-black"
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
              className="rounded-lg text-black"
              onChange={(e) => setPrimaryName(e.target.value)}
            />
          </div>
        </div>
        <div className="vernacular-name flex flex-col">
          <div className="py-2 text-white">
            <label>Vernacular Names</label>
          </div>
          <div className="">
            {componentVernacularNames.map((el, index) => (
              <div className="flex" key={index}>
                <select
                  className="flex my-1 mx-2"
                  onChange={(el) => {
                    const chosenIndex = el.target.selectedIndex;
                    const temp = componentVernacularNames;
                    temp[index] = vernacularNames[chosenIndex];
                    setComponentVernacularNames(temp);
                  }}
                >
                  {vernacularNames.map((vEl, vIndex) => (
                    <option key={vIndex} defaultValue={el.vernacular_name}>
                      {vEl.vernacular_name}
                    </option>
                  ))}
                </select>
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
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-lightgreen text-white p-2 text-center rounded-lg font-semibold mx-2"
            onClick={() => {
              var toSendObject = { primary_name, scientific_name };
              toSendObject["vernacular_names"] = componentVernacularNames;
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
export default NewTree;
