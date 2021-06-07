const {knex} = require('knex');
const knexFile = require('../../knexfile').development;
const db = knex(knexFile);
const {
  funcGetVernacularNameWithId,
} = require('../vernacular_name/vernacular_name');

const TABLENAME = 'basic_tree';
const funcGetTreeWithID = async (id) => {
  if (typeof id === 'object' && id !== null) {
    id = id.id;
  }
  const basicTreeObject = await db(TABLENAME)
      .where('id', id)
      .then((res) => {
        console.log('TreeObject: ', res[0]);
        return res[0];
      });

  let vernacularNameReferenceCollection;
  await Promise.all(
      (vernacularNameReferenceCollection = await getVernacularNameReference(
          basicTreeObject,
      )),
  );

  console.log(
      'vernacularNameReferenceCollection: ',
      vernacularNameReferenceCollection,
  );

  const vernacularNameObjectCollection = [];

  // get vernacular names according to reference
  await Promise.all(
      vernacularNameReferenceCollection.map(async (refObject) => {
        const tempObj = await funcGetVernacularNameWithId(
            refObject.vernacular_name_id,
        );
        vernacularNameObjectCollection.push(tempObj);
      }),
  );

  // add vernacular_names to basicTreeObject
  basicTreeObject['vernacular_names'] = vernacularNameObjectCollection;

  return basicTreeObject;
};

const getVernacularNameReference = async (args) => {
  return await db
      .where('basic_tree_id', args.id)
      .from('vernacular_name_reference')
      .then((obj) => {
        return obj;
      });
};
module.exports = {
  funcGetTreeWithID,
};
