var { knex } = require("knex");
///const knexFile = require("./knexfile").development;
const knexFile = require("./knexfile").development;
const db = knex(knexFile);

const funcGetAllTrees = () => {
  return db.select("*").from("trees");
};

const funcGetTreeWithId = async (args) => {
  return await db
    .where("id", args.id)
    .from("trees")
    .then((r) => {
      console.log("r ->", r[0]);
      return r[0];
    });
};

const funcInsertTree = async ({ common_name, scientific_name }) => {
  return db("trees")
    .insert({ common_name, scientific_name })
    .then((resp_id) => {
      return funcGetTreeWithId({ id: resp_id });
    });
};

const funcUpdateTree = async ({ id, common_name, scientific_name }) => {
  console.log("funcUpdateTree");
  const updated_at = Date.now();
  console.log("updated TIME NOW ->", updated_at);
  return db("trees")
    .where("id", id)
    .update({ common_name, scientific_name, updated_at: updated_at })
    .then(() => {
      return funcGetTreeWithId({ id: id });
    });
};

const funcDeleteTreeWithId = async ({ id }) => {
  const thisId = id;
  return db("trees")
    .where("id", id)
    .del()
    .then(() => {
      console.log(thisId);
      return thisId;
    });
};

module.exports = {
  getAllTrees: funcGetAllTrees,

  getTreeWithId: funcGetTreeWithId,
  insertTree: funcInsertTree,
  updateTreeWithId: funcUpdateTree,
  deleteTreeWithId: funcDeleteTreeWithId,
  //{ common_name: "crabwood", scientific_name: "carapa guianensis" },
  //{ common_name: "common baromalli", scientific_name: "catostemma commune" },
  //{ common_name: "red cedar", scientific_name: "cedrela odorata" },
};
