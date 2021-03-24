var { knex } = require("knex");
///const knexFile = require("./knexfile").development;
const knexFile = require("./knexfile").development;
const db = knex(knexFile);

module.exports = {
  getAllTrees: () => {
    return db.select("*").from("trees");
  },

  getTreeWithId: async (args) => {
    return await db
      .where("id", args.id)
      .from("trees")
      .then((r) => {
        console.log("r ->", r[0]);
        return r[0];
      });
  },

  insertTree: async ({ common_name, scientific_name }) => {
    return db("trees")
      .insert({ common_name, scientific_name })
      .then((resp) => `tree with id ${resp} inserted`);
  },

  updateTreeWithId: async ({ id, common_name, scientific_name }) => {
    return db("trees")
      .where("id", id)
      .update({ common_name, scientific_name })
      .then(() => {
        return `tree with id: ${id} was updated`;
      });
  },
  deleteTreeWithId: async ({ id }) => {
    return db("trees")
      .where("id", id)
      .del()
      .then(() => `tree with id: ${id} was deleted`);
  },
  //{ common_name: "crabwood", scientific_name: "carapa guianensis" },
  //{ common_name: "common baromalli", scientific_name: "catostemma commune" },
  //{ common_name: "red cedar", scientific_name: "cedrela odorata" },
};
