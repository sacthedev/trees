const {knex} = require('knex');
const knexFile = require('../../knexfile').development;
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

const funcInsertVernacularNameReference = async ({
  vernacular_name_id,
  basicTreeId,
}) => {
  const basic_tree_id = basicTreeId;
  console.log('funcInsertVernacularNameReference');
  return db(TABLENAME)
      .insert({vernacular_name_id, basic_tree_id})
      .returning('id')
      .then((resp_id) => {
        return resp_id;
      // vernacular_name_id;
      });
};

const funcUpdateVernacularNameReference = async ({
  id,
  basic_tree_id,
  vernacular_name_id,
}) => {
  return db(TABLENAME)
      .where('id', id)
      .update({vernacular_name_id, basic_tree_id})
      .then(() => {
        return 'success';
      });
};

const funcDeleteVernacularNameReferenceWithBasicTreeId = async (
    basic_tree_id,
) => {
  console.log('funcDeleteVernacularNameReferenceWithBasicTreeId');
  console.log('basic_tree_id: ', basic_tree_id);
  return db(TABLENAME)
      .where('basic_tree_id', basic_tree_id)
      .del()
      .then(() => {
        return `vernacular_name object with id ${basic_tree_id} deleted successfully`;
      });
};

module.exports = {
  funcGetAllVernacularNameReference,
  funcGetVernacularNameReferenceWithId,
  funcInsertVernacularNameReference,
  funcUpdateVernacularNameReference,
  funcDeleteVernacularNameReferenceWithBasicTreeId,
};
