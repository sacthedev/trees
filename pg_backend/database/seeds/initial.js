exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('basic_tree')
      .then(function() {
      // Inserts seed entries
        return knex('basic_tree').insert([
          {primary_name: 'greenheart', scientific_name: 'chlorocardium rodiei'},
          {primary_name: 'kabukalli', scientific_name: 'goupia glabra'},
          {primary_name: 'purpleheart', scientific_name: 'peltogyne venosa'},
          {primary_name: 'crabwood', scientific_name: 'carapa guianensis'},
          {primary_name: 'huruasa', scientific_name: 'abarema jupunba'},
          {primary_name: 'blackheart', scientific_name: 'acosmium praelarum'},
          {primary_name: 'hairaballi', scientific_name: 'alexa imperatricis'},
          {primary_name: 'koraro', scientific_name: 'andira surinamensis'},
        ]);
      });

  await knex('vernacular_name')
      .then(function() {
        return knex('vernacular_name').insert([
          {vernacular_name: 'hardwood'},
          {vernacular_name: 'softwood'},
          {vernacular_name: 'midwood'},
        ]);
      });

  await knex('vernacular_name_reference')
      .then(function() {
        return knex('vernacular_name_reference').insert([
	  {basic_tree_id: 1, vernacular_name_id: 1},
	  {basic_tree_id: 2, vernacular_name_id: 1},
	  {basic_tree_id: 1, vernacular_name_id: 2},
	  {basic_tree_id: 7, vernacular_name_id: 2},
        ]);
      });
};
