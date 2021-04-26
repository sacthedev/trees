const {knex} = require('knex');
const knexFile = require('./../knexfile').development;
const db = knex(knexFile);
const TABLENAME = 'vernacular_name_reference';

const funcGetAllVernacularNameReference = async () => {
  return db(TABLENAME)
      .select('*')
      .then((res) => {
        return res;
      });
};

const funcGetVernacularNameReferenceWithId = async (id) => {
  return db(TABLENAME)
      .where('id', id)
      .then((res) => {
        return res[0];
      });
};

const funcInsertVernacularNameReference = async ({vernacular_name_id, basicTreeId}) => {
  const basic_tree_id = basicTreeId;
  console.log('funcInsertVernacularNameReference');
  return db(TABLENAME)
      .insert({vernacular_name_id, basic_tree_id})
      .returning('id')
      .then((resp_id) => {
        return resp_id;
      });
};

const funcUpdateVernacularNameReference = async ({id, vernacular_name}) => {
  return db(TABLENAME)
      .where('id', id)
      .update({vernacular_name})
      .then(() => {
        return 'success';
      });
};

const funcDeleteVernacularNameReferenceWithId = async ({id}) => {
  return db(TABLENAME)
      .where('id', id)
      .del()
      .then(() => {
        return `vernacular_name object with id ${id} deleted successfully`;
      });
};

module.exports = {
  funcGetAllVernacularNameReference,
  funcGetVernacularNameReferenceWithId,
  funcInsertVernacularNameReference,
  funcUpdateVernacularNameReference,
  funcDeleteVernacularNameReferenceWithId,
};
