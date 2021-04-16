exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('trees')
      .del()
      .then(function() {
      // Inserts seed entries
        return knex('trees').insert([
          {common_name: 'greenheart', scientific_name: 'chlorocardium rodiei'},
          {common_name: 'kabukalli', scientific_name: 'goupia glabra'},
          {common_name: 'purpleheart', scientific_name: 'peltogyne venosa'},
        ]);
      });
};
