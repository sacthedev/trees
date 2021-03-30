import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import NewTree from "./NewTree";
import UpdateTree from "./UpdateTree";

const ALL_TREES = gql`
  query GetAllTrees {
    getAllTrees {
      id
      common_name
      scientific_name
    }
  }
`;

const INSERT_TREE = gql`
  mutation InsertTree($common_name: String, $scientific_name: String) {
    insertTree(common_name: $common_name, scientific_name: $scientific_name) {
      id
      common_name
      scientific_name
    }
  }
`;

const DELETE_TREE_WITH_ID = gql`
  mutation DeleteTreeWithId($id: ID) {
    deleteTreeWithId(id: $id)
  }
`;

const UPDATE_TREE_WITH_ID = gql`
  mutation UpdateTreeWithId(
    $id: ID
    $common_name: String
    $scientific_name: String
  ) {
    updateTreeWithId(
      id: $id
      common_name: $common_name
      scientific_name: $scientific_name
    ) {
      id
      common_name
      scientific_name
    }
  }
`;

function App() {
  const [headers, setHeaders] = useState([
    "id",
    "common_name",
    "scientific_name",
    "",
  ]);
  const { data, loading } = useQuery(ALL_TREES, {
    //fetchPolicy: "cache-and-network",
  });
  const [trees, setTrees] = useState([{}]);
  const [updateData, setUpdateData] = useState({});
  const [showModal, setShowModal] = useState("hidden");
  const [showUpdateTreeModal, setShowUpdateTreeModal] = useState("hidden");
  const [insertTree] = useMutation(INSERT_TREE, {
    update(cache, { data: { insertTree } }) {
      cache.modify({
        fields: {
          getAllTrees(existingTrees = []) {
            const newTreeRef = cache.writeFragment({
              data: insertTree,
              fragment: gql`
                fragment NewTree on Tree {
                  id
                  common_name
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
  const [deleteTreeWithId] = useMutation(DELETE_TREE_WITH_ID, {
    update(cache, { data: { deleteTreeWithId } }) {
      cache.modify({
        fields: {
          getAllTrees(existingTrees, { readField }) {
            return existingTrees.filter(
              (treeRef) => deleteTreeWithId !== readField("id", treeRef)
            );
          },
        },
      });
    },
  });

  const [updateTreeWithId] = useMutation(UPDATE_TREE_WITH_ID);
  useEffect(() => {
    if (!loading && data.getAllTrees) {
      setTrees(data.getAllTrees);
    }
  }, [data, loading]);

  function sendNewTrees(d) {
    console.log("sendNewTrees");
    console.log(d);
    insertTree({
      variables: {
        common_name: d.common_name,
        scientific_name: d.scientific_name,
      },
    });
  }

  function deleteTree(id) {
    console.log("delete tree -> id", id);
    deleteTreeWithId({
      variables: {
        id: id,
      },
    });
  }

  function updateTree(dataPayload) {
    console.log("update tree with id -> ", dataPayload);
    const { id, common_name, scientific_name } = dataPayload;
    updateTreeWithId({
      variables: {
        id: id,
        common_name: common_name,
        scientific_name: scientific_name,
      },
    });
  }
  return (
    <div className="App">
      <div className="container flex h-screen mx-auto bg-darkblue">
        <div className="left w-3/12 h-full border-r-2 border-gray-300">
          <div className="p-4 text-2xl font-semibold text-center text-white border-b-2 border-gray-300 header">
            Trees Dashboard
          </div>
          <div className="flex justify-center below-header justify-content-center">
            <div className="w-10/12 p-2 my-4 text-white rounded-lg filter-card bg-lightblue">
              <div className="card-header">
                <div className="text-center uppercase title">
                  filter trees by
                </div>
                <div className="horizontal-line">
                  <hr></hr>
                </div>
              </div>
              <div className="card-body">
                <ul>
                  <li>common name</li>
                  <li>scientific name</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="right w-full bg-red-500 p-2 m-2 flex justify-center items-center">
          <div className="w-11/12 right-item-holder bg-red-800 h-full py-5">
            <div className="rounded-lg info-area bg-lightblue h-full py-2">
              <div className="p-2 text-white info-header flex justify-between">
                <p>Number of trees in database: {trees.length}</p>
                <button
                  className="p-2 font-semibold rounded-lg bg-pink"
                  onClick={() => {
                    setShowModal(showModal === "hidden" ? "" : "hidden");
                  }}
                >
                  Add new tree
                </button>
                <NewTree
                  showModal={showModal}
                  onShowModalChange={(ret) => setShowModal(ret)}
                  newTreeData={(ret) => sendNewTrees(ret)}
                ></NewTree>
              </div>
              <div className="bg-yellow-200 m-2 h-5/6 flex-grow overflow-y-scroll rounded-xl">
                <table className="w-full text-white">
                  <thead className="bg-yellow-500 text-white px-5">
                    <tr className="bg-yellow-500">
                      {headers.map((el) => (
                        <th
                          key={el.toString()}
                          className="w-1/4 p-2 sticky bg-black top-0"
                        >
                          {el}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trees.map((el, index) => (
                      <tr
                        className={
                          index % 2 == 0 ? "bg-darkgray" : "bg-lightgray"
                        }
                        key={index}
                      >
                        <td className="text-center">{el.id}</td>
                        <td className="">{el.common_name}</td>
                        <td className="">{el.scientific_name}</td>
                        <td className="flex justify-center items-center my-2">
                          <button
                            className="bg-pink rounded-lg mx-2"
                            onClick={() => deleteTree(el.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="h-10"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
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
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="h-10"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <UpdateTree
                  currentTreeData={updateData}
                  showUpdateTreeModal={showUpdateTreeModal}
                  onShowUpdateTreeModalChange={(ret) =>
                    setShowUpdateTreeModal(ret)
                  }
                  newTreeData={(ret) => updateTree(ret)}
                ></UpdateTree>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
