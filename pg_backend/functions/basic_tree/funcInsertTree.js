const {knex} = require('knex');
const knexFile = require('../../knexfile').development;
const db = knex(knexFile);

const {funcGetTreeWithID} = require('./funcGetTreeWithID');
const {
  funcGetAllVernacularName,
  funcInsertVernacularName,
} = require('../vernacular_name/vernacular_name');

const {
  funcInsertVernacularNameReference,
} = require('../vernacular_name_reference/vernacular_name_reference');

const funcInsertTree = async ({
  scientific_name,
  primary_name,
  vernacular_names,
}) => {
  // insert basic tree
  const basicTreeId = await db('basic_tree')
      .insert({scientific_name, primary_name})
      .returning('id')
      .then((returnedId) => {
        return returnedId[0];
      });

  // insert vernacular name references to basic tree
  if (vernacular_names === undefined) {
    console.log('vernacular_names === undefined');
    vernacular_names = [];
  }
  vernacular_names = JSON.parse(JSON.stringify(vernacular_names));
  if (vernacular_names.length > 0) {
    // get all names in vernacular_names table
    const allVernacularNames = await funcGetAllVernacularName();

    idsToReference = [];
    namesToInsert = [];
    vernacular_names.map((nameObject) => {
      const {flag, id} = checkNameIn(
          allVernacularNames,
          nameObject.vernacular_name,
      );
      if (flag) {
        idsToReference.push(id);
      } else {
        namesToInsert.push(nameObject);
      }
    });

    await Promise.all(
        // insert names not in vernacular name table whilst pushing ids to idsToReference
        namesToInsert.map(async (nameObject) => {
          const returnedVernacularNameObject = await funcInsertVernacularName(
              nameObject,
          );
          idsToReference.push(returnedVernacularNameObject.id);
        }),
    );

    await Promise.all(
        // insert vernacular_name_reference ids for this tree
        idsToReference.map(async (vernacular_name_id) => {
          console.log('idsToReference: ', idsToReference);
          await funcInsertVernacularNameReference({
            vernacular_name_id,
            basicTreeId,
          });
        }),
    );
  }

  return funcGetTreeWithID(basicTreeId);
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
  funcInsertTree,
};
