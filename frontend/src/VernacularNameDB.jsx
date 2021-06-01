import React, { useEffect, useState } from "react";

function VernacularNameDB(props) {
  const {
    vernacularNames,
    newVernacularNameFromVernacularNameDB,
    deleteVernacularNameFromVernacularNameDB,
    updateVernacularNameFromVernacularNameDB,
  } = props;
  const [vernacularNameInput, setVernacularNameInput] = useState("");
  const [newVernacularName, setNewVernacularName] = useState("");
  const [indexChanged, setIndexChanged] = useState(0);
  const [showNewVernacularNameInput, setshowNewVernacularNameInput] = useState(
    false
  );
  return (
    <div className="bg-blue-500">
      <p className="text-white">Vernacular DB Operations</p>
      <div className="flex">
        <div>
          {vernacularNames.map((e, index) => (
            <div className="flex items-center" key={index}>
              <p>{e.id}</p>
              <input
                className="bg-pink-200 p-1 m-1"
                id={`input-${index}`}
                defaultValue={e.vernacular_name}
                onChange={(el) => {
                  console.log("changed");
                  setIndexChanged(index);
                  setVernacularNameInput(el.target.value);
                }}
              />
              <button
                id="delete-button"
                onClick={() => {
                  console.log("delete");
                  deleteVernacularNameFromVernacularNameDB(e.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  stroke="none"
                  className="fill-current text-danger"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
              {indexChanged == index && (
                <div className="flex items-center">
                  <button
                    id="refresh-button"
                    onClick={() => {
                      console.log("Refresh");
                      setVernacularNameInput(e.vernacular_name);
                      document.getElementById(`input-${index}`).value =
                        e.vernacular_name;
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      fill="#000000"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                    </svg>
                  </button>
                  <button
                    id="send-button"
                    onClick={() => {
                      console.log("send Updated Vernacular Name");
                      updateVernacularNameFromVernacularNameDB({
                        id: e.id,
                        vernacular_name: vernacularNameInput,
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      className="fill-current text-darkyellow mx-2"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="vernacular-name-add py-2">
        <div className="flex items-center justify-center">
          <button
            className="bg-lightgreen rounded-lg text-xs p-1 font-semibold"
            onClick={() => {
              setshowNewVernacularNameInput(!showNewVernacularNameInput);
            }}
          >
            + ADD NEW VERNACULAR NAME
          </button>
        </div>
        {showNewVernacularNameInput && (
          <div className="flex items-center justify-center">
            <input
              className="bg-pink-200 p-1 m-1"
              onChange={(el) => {
                setVernacularNameInput(el.target.value);
              }}
            />
            <button
              onClick={() => {
                newVernacularNameFromVernacularNameDB(vernacularNameInput);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                className="fill-current text-darkyellow mx-2"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VernacularNameDB;
/*
<button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  className="fill-current text-darkyellow mx-2"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
              <button>
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
	      */
