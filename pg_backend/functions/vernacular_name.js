const {knex} = require('knex');
const knexFile = require('./../knexfile').development;
const db = knex(knexFile);

const funcGetAllVernacularName = async () => {
  return db('vernacular_name')
      .select('*')
      .then((res) => {
        return res;
      });
};

const funcGetVernacularNameWithId = async (id) => {
  return db('vernacular_name')
      .where('id', id)
      .then((res) => {
        return res[0];
      });
};

const funcInsertVernacularName = async ({vernacular_name}) => {
  console.log('funcInsertVernacularName');
  return db('vernacular_name')
      .insert({vernacular_name})
      .returning('id')
      .then((resp_id) => {
        return resp_id;
      });
};

const funcUpdateVernacularName = async ({id, vernacular_name}) => {
  return db('vernacular_name')
      .where('id', id)
      .update({vernacular_name})
      .then(() => {
        return 'success';
      });
};

const funcDeleteVernacularNameWithId = async ({id}) => {
  return db('vernacular_name')
      .where('id', id)
      .del()
      .then(() => {
        return `vernacular_name object with id ${id} deleted successfully`;
      });
};

module.exports = {
  funcGetAllVernacularName,
  funcGetVernacularNameWithId,
  funcInsertVernacularName,
  funcUpdateVernacularName,
  funcDeleteVernacularNameWithId,
};
