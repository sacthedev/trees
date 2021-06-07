import { gql } from '@apollo/client';

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
      vernacular_names {
        id
        vernacular_name
      }
    }
  }
`;
const INSERT_TREE = gql`
  mutation InsertTree(
    $primary_name: String
    $scientific_name: String
    $vernacular_names: [vernacular_name_input]
  ) {
    insertTree(
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
  mutation DeleteTreeWithID($id: ID!) {
    deleteTreeWithID(id: $id)
  }
`;

const UPDATE_TREE_WITH_ID = gql`
  mutation UpdateTreeWithID(
    $id: ID!
    $primary_name: String
    $scientific_name: String
    $vernacular_names: [vernacular_name_input]
  ) {
    updateTreeWithID(
      id: $id
      primary_name: $primary_name
      scientific_name: $scientific_name
      vernacular_names: $vernacular_names
    ) {
      id
      primary_name
      scientific_name
      vernacular_names {
        id
        vernacular_name
      }
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

const UPDATE_VERNACULAR_NAME_WITH_ID = gql`
  mutation UpdateVernacularNameWithId($id: ID, $vernacular_name: String) {
    updateVernacularNameWithId(id: $id, vernacular_name: $vernacular_name) {
      id
      vernacular_name
    }
  }
`;

const DELETE_VERNACULAR_NAME_WITH_ID = gql`
  mutation DeleteVernacularNameWithId($id: ID) {
    deleteVernacularNameWithId(id: $id)
  }
`;


module.exports  = {
    ALL_VERNACULAR_NAMES,
    ALL_TREES,
    INSERT_TREE,
    DELETE_TREE_WITH_ID,
    UPDATE_TREE_WITH_ID,
    INSERT_NEW_VERNACULAR_NAME,
    UPDATE_VERNACULAR_NAME_WITH_ID,
    DELETE_VERNACULAR_NAME_WITH_ID
}