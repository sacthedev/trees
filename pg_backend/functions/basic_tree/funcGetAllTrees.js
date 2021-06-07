const {knex} = require('knex');
const knexFile = require('../../knexfile').development;
const db = knex(knexFile);
const {
  funcGetVernacularNameWithId,
} = require('../vernacular_name/vernacular_name');
const funcGetAllTrees = async () => {
  return await db
      .select()
      .table('basic_tree')
      .then(async (res) => {
        const finalTreeObjectCollection = [];
        await Promise.all(
            res.map(async (basicTreeObject) => {
              // get all references within vernacular_name_reference by basicTreeObject.id
              const vernacularNameReferenceCollection = await getVernacularNameReference(
                  basicTreeObject,
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
              // push the final object to finalTreeObjectCollection
              finalTreeObjectCollection.push(basicTreeObject);
            }),
        );
        return finalTreeObjectCollection.sort(
            (a, b) => parseInt(a.id) - parseInt(b.id),
        );
      });
};

const getVernacularNameReference = async (args) => {
  return await db
      .where('basic_tree_id', args.id)
      .from('vernacular_name_reference')
      .then((obj) => {
        return obj;
      });
};

module.exports = {funcGetAllTrees};
