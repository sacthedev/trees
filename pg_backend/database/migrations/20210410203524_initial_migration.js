exports.up = function(knex) {
  return knex.schema.createTable('trees', function(table) {
    table.increments().notNullable();
    table.timestamp(
        'created_at',
        {precision: 3, useTz: true},
    ).defaultTo(knex.fn.now(6));
    table.timestamp(
        'updated_at',
        {precision: 3, useTz: true},
    ).defaultTo(knex.fn.now(6));
    table.string('primary_name');
    table.string('scientific_name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trees');
};
