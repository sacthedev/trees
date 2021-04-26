const {knex} = require('knex');
const knexFile = require('./../knexfile').development;
const db = knex(knexFile);
const {funcGetVernacularNameWithId, funcGetAllVernacularName, funcInsertVernacularName} = require('./vernacular_name.js');
const {funcInsertVernacularNameReference} = require('./vernacular_name_reference');
const TABLENAME = 'basic_tree';

const funcGetAllTrees = async () => {
  return await db.select().table('basic_tree')
      .then(async (res) => {
        const finalTreeObjectCollection = [];
        await Promise.all(
            res.map(async (basicTreeObject) => {
	      // get all references within vernacular_name_reference by basicTreeObject.id
	      const vernacularNameReferenceCollection = await getVernacularNameReference(basicTreeObject);
	      console.log(vernacularNameReferenceCollection);

	      const vernacularNameObjectCollection = [];

	      // get vernacular names according to reference
	      await Promise.all(
                  vernacularNameReferenceCollection.map(async (refObject) => {
		  const tempObj = await funcGetVernacularNameWithId(refObject.vernacular_name_id);
		  vernacularNameObjectCollection.push(tempObj);
                  }),
	      );

	      // add vernacular_names to basicTreeObject
	      basicTreeObject['vernacular_names'] = vernacularNameObjectCollection;
	      console.log(basicTreeObject);
	      // push the final object to finalTreeObjectCollection
	      finalTreeObjectCollection.push(basicTreeObject);
	    }),
        );
        console.log('finalTree: ', finalTreeObjectCollection);
        return finalTreeObjectCollection;
      });
};

const getVernacularNameReference = async (args) => {
  console.log('getVernacularNameReference');
  return await db
      .where('basic_tree_id', args.id)
      .from('vernacular_name_reference')
      .then((obj) => {
        return obj;
      });
};

const funcGetTreeWithId = async (id) => {
  console.log('funcGetTreeWithId');
  console.log(id);
  const basicTreeObject = await db(TABLENAME)
      .where('id', id)
      .then((res) => {
        console.log('TreeObject: ', res[0]);
        return res[0];
      });

  let vernacularNameReferenceCollection;
  await Promise.all(
      vernacularNameReferenceCollection =
	await getVernacularNameReference(basicTreeObject),
  );

  console.log('vernacularNameReferenceCollection: ', vernacularNameReferenceCollection);

  const vernacularNameObjectCollection = [];

  // get vernacular names according to reference
  await Promise.all(
      vernacularNameReferenceCollection.map(async (refObject) => {
        const tempObj = await funcGetVernacularNameWithId(refObject.vernacular_name_id);
        vernacularNameObjectCollection.push(tempObj);
      }),
  );

  console.log('vernacularNameObjectCollection: ', vernacularNameObjectCollection);
  // add vernacular_names to basicTreeObject
  basicTreeObject['vernacular_names'] = vernacularNameObjectCollection;

  console.log('funcGetTreeWithId end');
  return basicTreeObject;
};

const funcInsertTree = async ({scientific_name, primary_name, vernacular_names}) => {
  console.log('funcInsertTree');
  // insert basic tree
  const basicTreeId = await db('basic_tree')
      .insert({scientific_name, primary_name})
      .returning('id')
      .then((returnedId) => {
        return returnedId[0];
      });

  // insert vernacular name references to basic tree
  vernacular_names = JSON.parse(JSON.stringify(vernacular_names));
  if (vernacular_names.length > 0) {
    console.log('VERNACULAR NAMES length > 0');
    // get all names in vernacular_names table
    const allVernacularNames = await funcGetAllVernacularName();

    console.log('allVernacularNames: ', allVernacularNames);
    console.log('vernacular_names: ', vernacular_names);
    idsToReference = [];
    namesToInsert = [];
    vernacular_names.map((nameObject) => {
      console.log('namesObject => ', nameObject);
      const {flag, id} = checkNameIn(allVernacularNames, nameObject.vernacular_name);
      if ( flag) {
        idsToReference.push(id);
      } else {
        namesToInsert.push(nameObject);
      }
    });

    console.log('namesToInsert: ', namesToInsert);
    console.log('idsToReference: ', idsToReference);

    await Promise.all(
        namesToInsert.map(async (nameObject) => {
          // insert names not in vernacular name table whilst pushing ids to idsToReference
          const returnedId = await funcInsertVernacularName(nameObject);
	  console.log('returnedId: ', returnedId);
          idsToReference.push(returnedId[0]);
        }),
    );

    console.log('idsToReferenceAFTER: ', idsToReference);
    console.log('basicTreeId: ', basicTreeId);
    await Promise.all(
        // insert vernacular_name_reference ids for this tree
        idsToReference.map(async (vernacular_name_id) => {
          await funcInsertVernacularNameReference({vernacular_name_id, basicTreeId});
        }),
    );
  }

  console.log('END');
  return funcGetTreeWithId(basicTreeId);
};

const checkNameIn = (allVernacularNames, vernacularName) => {
  for (let i = 0; i < allVernacularNames.length; i++) {
    if (allVernacularNames[i].vernacular_name == vernacularName) {
      return {flag: true, id: allVernacularNames[i].id};
    }
  }
  return {flag: false, id: null};
};

module.exports = {
  funcGetAllTrees,
  funcInsertTree,
};
