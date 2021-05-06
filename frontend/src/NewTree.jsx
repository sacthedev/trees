import React, { useState } from 'react';

function NewTree(props) {
  const { showModal, onShowModalChange, newTreeData } = props;
  const [scientific_name, setScientificName] = useState(0);
  const [primary_name, setPrimaryName] = useState(0);
  const [vernacular_names, setVernacularNames] = useState(0);
  return (
    <div
      className={`${showModal} modal fixed z-100 inset-0 h-screen flex justify-center items-center bg-gray-300 bg-opacity-25`}
    >
      <div className="card bg-darkblue w-1/3 space-y-4 rounded-lg py-4 opacity-100">
        <div className="scientific-name flex justify-center items-center">
          <div>
            <div>
              <label>Scientific Name</label>
            </div>
            <input
              type="text"
              value={scientific_name}
              className="rounded-lg text-black"
              onChange={(e) => setScientificName(e.target.value)}
            />
          </div>
        </div>
        <div className="common-name flex justify-center items-center">
          <div>
            <div>
              <label>Common Name</label>
            </div>
            <input
              value={primary_name}
              type="text"
              className="rounded-lg text-black"
              onChange={(e) => setPrimaryName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-green text-white p-2 text-center rounded-lg font-semibold mx-2"
            onClick={() => newTreeData({ primary_name, scientific_name, vernacular_names })}
          >
            Send
          </button>

          <button
            className="bg-pink text-white p-2 text-center rounded-lg font-semibold mx-2"
            onClick={() => onShowModalChange('hidden')}
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
}
export default NewTree;
