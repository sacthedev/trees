exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('trees')
      .del()
      .then(function() {
      // Inserts seed entries
        return knex('trees').insert([
          {primary_name: 'greenheart', scientific_name: 'chlorocardium rodiei'},
          {primary_name: 'kabukalli', scientific_name: 'goupia glabra'},
          {primary_name: 'purpleheart', scientific_name: 'peltogyne venosa'},
        ]);
      });
};
