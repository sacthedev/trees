const {knex} = require('knex');
const knexFile = require('./../knexfile').development;
const db = knex(knexFile);

const funcGetAllVernacularName = async () => {
  console.log('in funcGetAllVernacularName');
  return db('vernacular_name')
      .select('*')
      .then((res) => {
        return res.sort((a, b) => parseInt(a.id) - parseInt(b.id));
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
        console.log('resp_id: ', resp_id);
        const vernacularNameWithId = funcGetVernacularNameWithId(resp_id[0]);
        return vernacularNameWithId;
      });
};

const funcUpdateVernacularName = async ({id, vernacular_name}) => {
  return db('vernacular_name')
      .where('id', id)
      .update({vernacular_name})
      .then(() => {
        const vernacularNameWithId = funcGetVernacularNameWithId(id);
        return vernacularNameWithId;
      });
};

const funcDeleteVernacularNameWithId = async ({id}) => {
  return db('vernacular_name')
      .where('id', id)
      .del()
      .then(() => {
        return id;
      });
};

module.exports = {
  funcGetAllVernacularName,
  funcGetVernacularNameWithId,
  funcInsertVernacularName,
  funcUpdateVernacularName,
  funcDeleteVernacularNameWithId,
};
