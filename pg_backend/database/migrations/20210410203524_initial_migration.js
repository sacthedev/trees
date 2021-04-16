exports.up = function(knex) {
  return knex.schema.createTable('trees', function(table) {
    table.increments().notNullable();
    table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.timestamp('updated_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.string('common_name');
    table.string('scientific_name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trees');
};
