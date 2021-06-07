const {knex} = require('knex');
const knexFile = require('../../knexfile').development;
const db = knex(knexFile);

const TABLENAME = 'basic_tree';

const funcDeleteTreeWithID = async ({id}) => {
  return db(TABLENAME)
      .where('id', id)
      .del()
      .then(() => {
        return id;
      });
};

module.exports = {
  funcDeleteTreeWithID,
};
