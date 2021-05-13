import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import NewTree from "./NewTree";
import UpdateTree from "./UpdateTree";

const ALL_VERNACULAR_NAMES = gql`
  query GetAllVernacularNames {
    getAllVernacularNames {
      id
      vernacular_name
    }
  }
`;

const ALL_TREES = gql`
  query GetAllTrees {
    getAllTrees {
      id
      primary_name
      scientific_name
    }
  }
`;
const INSERT_TREE = gql`
  mutation InsertTreeWithVernacularNames(
    $primary_name: String
    $scientific_name: String
    $vernacular_names: [vernacular_name_input]
  ) {
    insertTreeWithVernacularNames(
      primary_name: $primary_name
      scientific_name: $scientific_name
      vernacular_names: $vernacular_names
    ) {
      id
      primary_name
      scientific_name
    }
  }
`;

const DELETE_TREE_WITH_ID = gql`
  mutation DeleteTreeWithId($id: ID!) {
    deleteTreeWithId(id: $id)
  }
`;

const UPDATE_TREE_WITH_ID = gql`
  mutation UpdateTreeWithoutVernacularNames(
    $id: ID!
    $primary_name: String
    $scientific_name: String
  ) {
    updateTreeWithoutVernacularNames(
      id: $id
      primary_name: $primary_name
      scientific_name: $scientific_name
    ) {
      id
      primary_name
      scientific_name
    }
  }
`;

const INSERT_NEW_VERNACULAR_NAME = gql`
  mutation InsertVernacularName($vernacular_name: String) {
    insertVernacularName(vernacular_name: $vernacular_name) {
      id
      vernacular_name
    }
  }
`;

function App() {
  const [headers, setHeaders] = useState([
    "id",
    "Primary Name",
    "Scientific Name",
    "",
  ]);
  /*
  const { data, loading } = useQuery(ALL_TREES, {
    //fetchPolicy: "cache-and-network",
  });
  */
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
      console.log("cache: ", cache);
      console.log("data: ", insertVernacularName);
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
  const [insertTreeWithVernacularNames] = useMutation(INSERT_TREE, {
    update(cache, { data: { insertTreeWithVernacularNames } }) {
      console.log("cache: ", cache);
      console.log("data: ", insertTreeWithVernacularNames);
      cache.modify({
        fields: {
          getAllTrees(existingTrees = []) {
            const newTreeRef = cache.writeFragment({
              data: insertTreeWithVernacularNames,
              fragment: gql`
                fragment NewTree on final_tree {
                  id
                  primary_name
                  scientific_name
                }
              `,
            });
            console.log("existingTrees: ", existingTrees);
            console.log("newTreeRef: ", newTreeRef);
            return [...existingTrees, newTreeRef];
          },
        },
      });
    },
  });

  const [deleteTreeWithId] = useMutation(DELETE_TREE_WITH_ID, {
    update(cache, { data: { deleteTreeWithId } }) {
      console.log("cache: ", cache);
      console.log("deleteTreeWithId: ", deleteTreeWithId);
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
    console.log("*******useEffect ALL_TREES*********");
    if (!treeDataLoading && treesData.getAllTrees) {
      setTrees(treesData.getAllTrees);
      console.log("treeData: ", treesData);
    }
    console.log("*************************");
  }, [treesData, treeDataLoading]);

  useEffect(() => {
    console.log("*******useEffect ALL_VERNACULAR_NAMES*********");
    if (
      !vernacularNamesDataLoading &&
      vernacularNamesData.getAllVernacularNames
    ) {
      setVernacularNames(vernacularNamesData.getAllVernacularNames);
      console.log("vernacularNamesData: ", vernacularNamesData);
    }
    console.log("*************************");
  }, [vernacularNamesData, vernacularNamesDataLoading]);

  function sendNewVernacularName(newVernacularNameData) {
    console.log("sendNewVernacularName");
    console.log(newVernacularNameData);
    insertVernacularName({
      variables: {
        vernacular_name: newVernacularNameData,
      },
    });
  }

  function sendNewTrees(d) {
    console.log("sendNewTrees");
    console.log(d);
    //remove __typename from d.vernacular_names
    let temp = [];
    d.vernacular_names.map((el) => {
      temp.push({ id: el.id, vernacular_name: el.vernacular_name });
    });
    d["vernacular_names"] = temp;
    console.log("toSend: ", JSON.stringify(d));
    insertTreeWithVernacularNames({
      variables: {
        primary_name: d.primary_name,
        scientific_name: d.scientific_name,
        vernacular_names: d.vernacular_names,
        //vernacular_names: [{ id: 1, vernacular_name: "hardwood" }],
      },
    });
  }

  function deleteTree(id) {
    console.log("delete tree -> id", id);
    deleteTreeWithId({
      variables: {
        id,
      },
    });
  }

  function updateTree(dataPayload) {
    console.log("UPDATE TREE WITH ID -> ", dataPayload.id);
    const { id, primary_name, scientific_name } = dataPayload;
    updateTreeWithId({
      variables: {
        id,
        primary_name,
        scientific_name,
      },
    });
  }
  return (
    <div className="App font-sans">
      {vernacularNames && (
        <NewTree
          vernacularNames={vernacularNames}
          showModal={showModal}
          onShowModalChange={(ret) => setShowModal(ret)}
          newTreeData={(ret) => sendNewTrees(ret)}
          newVernacularName={(ret) => sendNewVernacularName(ret)}
        ></NewTree>
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
                            className="rounded-lg mx-2"
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
