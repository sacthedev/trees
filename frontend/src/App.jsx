import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import NewTree from "./NewTree";
import UpdateTree from "./UpdateTree";
import {
  ALL_VERNACULAR_NAMES,
  ALL_TREES,
  INSERT_TREE,
  DELETE_TREE_WITH_ID,
  UPDATE_TREE_WITH_ID,
  INSERT_NEW_VERNACULAR_NAME,
  UPDATE_VERNACULAR_NAME_WITH_ID,
  DELETE_VERNACULAR_NAME_WITH_ID
} from "./graphql_schema";

function App() {
  const [headers, setHeaders] = useState([
    "id",
    "Primary Name",
    "Scientific Name",
    "",
  ]);
  const allTreesQuery = useQuery(ALL_TREES);
  const treesData = allTreesQuery.data;
  const treeDataLoading = allTreesQuery.loading;

  const vernacularNamesDataQuery = useQuery(ALL_VERNACULAR_NAMES);
  const vernacularNamesData = vernacularNamesDataQuery.data;
  const vernacularNamesDataLoading = vernacularNamesDataQuery.loading;

  const [trees, setTrees] = useState([{}]);
  const [vernacularNames, setVernacularNames] = useState([{}]);
  const [updateData, setUpdateData] = useState({});
  const [showModal, setShowModal] = useState("hidden");
  const [showUpdateTreeModal, setShowUpdateTreeModal] = useState("hidden");
  const [insertVernacularName] = useMutation(INSERT_NEW_VERNACULAR_NAME, {
    update(cache, { data: { insertVernacularName } }) {
      cache.modify({
        fields: {
          getAllVernacularNames(existingVernacularNames = []) {
            const newVernacularNameRef = cache.writeFragment({
              data: insertVernacularName,
              fragment: gql`
                fragment NewVernacularName on vernacular_name {
                  id
                  vernacular_name
                }
              `,
            });
            return [...existingVernacularNames, newVernacularNameRef];
          },
        },
      });
    },
  });
  const [insertTree] = useMutation(INSERT_TREE, {
    update(cache, { data: { insertTree } }) {
      cache.modify({
        fields: {
          getAllTrees(existingTrees = []) {
            const newTreeRef = cache.writeFragment({
              data: insertTree,
              fragment: gql`
                fragment NewTree on final_tree {
                  id
                  primary_name
                  scientific_name
                }
              `,
            });
            return [...existingTrees, newTreeRef];
          },
        },
      });
    },
  });

  const [deleteVernacularNameWithId] = useMutation(
    DELETE_VERNACULAR_NAME_WITH_ID,
    {
      update(cache, { data: { deleteVernacularNameWithId } }) {
        cache.modify({
          fields: {
            getAllVernacularNames(existingVernacularNames, { readField }) {
              return existingVernacularNames.filter(
                (vernacularNameRef) =>
                  deleteVernacularNameWithId !==
                  readField("id", vernacularNameRef)
              );
            },
          },
        });
      },
    }
  );
  const [deleteTreeWithID] = useMutation(DELETE_TREE_WITH_ID, {
    update(cache, { data: { deleteTreeWithID } }) {
      cache.modify({
        fields: {
          getAllTrees(existingTrees, { readField }) {
            return existingTrees.filter(
              (treeRef) => deleteTreeWithID !== readField("id", treeRef)
            );
          },
        },
      });
    },
  });
  const [updateTreeWithID] = useMutation(UPDATE_TREE_WITH_ID);

  const [updateVernacularNameWithId] = useMutation(
    UPDATE_VERNACULAR_NAME_WITH_ID
  );
  useEffect(() => {
    if (!treeDataLoading && treesData.getAllTrees) {
      setTrees(treesData.getAllTrees);
    }
  }, [treesData, treeDataLoading]);

  useEffect(() => {
    if (
      !vernacularNamesDataLoading &&
      vernacularNamesData.getAllVernacularNames
    ) {
      setVernacularNames(vernacularNamesData.getAllVernacularNames);
    }
  }, [vernacularNamesData, vernacularNamesDataLoading]);

  function sendNewVernacularName(newVernacularNameData) {
    insertVernacularName({
      variables: {
        vernacular_name: newVernacularNameData,
      },
    });
  }

  function updateVernacularName(updatedVernacularNameData) {
    updateVernacularNameWithId({
      variables: {
        ...updatedVernacularNameData,
      },
    });
  }
  function deleteVernacularName(id) {
    deleteVernacularNameWithId({
      variables: { id },
    });
  }
  function sendNewTrees(d) {
    //remove __typename from d.vernacular_names
    let temp = [];
    d.vernacular_names.map((el) => {
      temp.push({ id: el.id, vernacular_name: el.vernacular_name });
    });
    d["vernacular_names"] = temp;
    insertTree({
      variables: {
        primary_name: d.primary_name,
        scientific_name: d.scientific_name,
        vernacular_names: d.vernacular_names,
        //vernacular_names: [{ id: 1, vernacular_name: "hardwood" }],
      },
    });
  }

  function deleteTree(id) {
    deleteTreeWithID({
      variables: {
        id,
      },
    });
  }

  function updateTree(dataPayload) {
    //remove __typename from dataPayload.vernacular_names
    let temp = [];
    dataPayload.vernacular_names.map((el) => {
      temp.push({ id: el.id, vernacular_name: el.vernacular_name });
    });
    dataPayload["vernacular_names"] = temp;
    const { id, primary_name, scientific_name, vernacular_names } = dataPayload;
    updateTreeWithID({
      variables: {
        id,
        primary_name,
        scientific_name,
        vernacular_names,
      },
    });
  }
  return (
    <div className="App font-sans">
      {vernacularNames && (
        <NewTree
          newTreeData={(ret) => sendNewTrees(ret)}
          onShowModalChange={(ret) => setShowModal(ret)}
          vernacularNames={vernacularNames}
          showModal={showModal}
          newVernacularName={(ret) => sendNewVernacularName(ret)}
          newVernacularNameFromVernacularNameDB={(ret) =>
            sendNewVernacularName(ret)
          }
          updateVernacularNameFromVernacularNameDB={(ret) =>
            updateVernacularName(ret)
          }
          deleteVernacularNameFromVernacularNameDB={(ret) => {
            deleteVernacularName(ret);
          }}
        ></NewTree>
      )}
      {showUpdateTreeModal === "" && (
        <UpdateTree
          newTreeData={(ret) => updateTree(ret)}
          showUpdateTreeModal={showUpdateTreeModal}
          updateData={updateData}
          vernacularNames={vernacularNames}
          onShowModalChange={(ret) => setShowUpdateTreeModal(ret)}
          newVernacularNameFromVernacularNameDB={(ret) =>
            sendNewVernacularName(ret)
          }
          updateVernacularNameFromVernacularNameDB={(ret) =>
            updateVernacularName(ret)
          }
          deleteVernacularNameFromVernacularNameDB={(ret) => {
            deleteVernacularName(ret);
          }}
        ></UpdateTree>
      )}
      <div className="container flex h-screen mx-auto bg-darkblue">
        <div className="left w-3/12 h-full bg-lightblue">
          <div className="p-4 text-2xl font-semibold text-center text-white border-b-2 border-gray-300 header">
            Trees Dashboard
          </div>
        </div>
        <div className="right w-full p-2 m-2 flex justify-center items-center">
          <div className="w-11/12 right-item-holder h-full py-5">
            <div className="rounded-lg info-area h-full py-2">
              <div className="p-2 text-white info-header flex justify-between">
                <div className="bg-lightblue flex items-center m-2 p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="35px"
                    viewBox="0 0 24 24"
                    width="35px"
                    fill="darkgreen"
                    stroke="none"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" />
                  </svg>
                  <p className="text-3xl font-bold px-2">{trees.length}</p>
                  <p className="font-semibold px-2">Trees</p>
                </div>
                <div className="flex items-center">
                  <button
                    className="p-2 font-semibold rounded-lg bg-lightgreen text-black"
                    onClick={() => {
                      setShowModal(showModal === "hidden" ? "" : "hidden");
                    }}
                  >
                    + ADD TREE
                  </button>
                </div>
              </div>
              <div className="bg-lightblue m-2 h-5/6 flex-grow overflow-y-scroll rounded-xl pt-10">
                <table className="w-full text-white">
                  <thead className="text-headerTextWhite px-5">
                    <tr className="">
                      {headers.map((el) => (
                        <th
                          key={el.toString()}
                          className="w-1/4 p-2 bg-headerBlue"
                        >
                          {el}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-rowTextWhite">
                    {trees.map((el, index) => (
                      <tr key={index}>
                        <td className="text-center">{el.id}</td>
                        <td className="">{el.primary_name}</td>
                        <td className="">{el.scientific_name}</td>
                        <td className="flex justify-center items-center my-4">
                          <button
                            className="update-button bg-green rounded-lg mx-2"
                            onClick={() => {
                              setShowUpdateTreeModal("");
                              setUpdateData(el);
                              console.log("i was clicked");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              className="fill-current text-darkyellow"
                              stroke="none"
                            >
                              <path d="M0 0h24v24H0z" fill="none" />
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          </button>
                          <button
                            className="delete-button rounded-lg mx-2"
                            onClick={() => deleteTree(el.id)}
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
