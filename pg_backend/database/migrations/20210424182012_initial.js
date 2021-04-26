
exports.up = async function(knex) {
  await knex.schema.createTable('basic_tree', function(table) {
    table.increments();
    table.timestamp('created_at', {precision: 3}).defaultTo(knex.fn.now(3));
    table.timestamp('updated_at', {precision: 3}).defaultTo(knex.fn.now(3));
    table.string('primary_name');
    table.string('scientific_name');
    table.string('botanical_description');
    table.string('field_characteristics');
  });

  await knex.schema.createTable('vernacular_name', function(table) {
    table.increments();
    table.timestamp('created_at', {precision: 3}).defaultTo(knex.fn.now(3));
    table.timestamp('updated_at', {precision: 3}).defaultTo(knex.fn.now(3));
    table.string('vernacular_name');
  });

  await knex.schema.createTable('vernacular_name_reference', function(table) {
    table.increments();
    table.timestamp('created_at', {precision: 3}).defaultTo(knex.fn.now(3));
    table.timestamp('updated_at', {precision: 3}).defaultTo(knex.fn.now(3));
    table.integer('basic_tree_id').references('basic_tree.id').onDelete('CASCADE');
    table.integer('vernacular_name_id').references('vernacular_name.id');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('vernacular_name_reference');
  await knex.schema.dropTable('basic_tree');
  await knex.schema.dropTable('vernacular_name');
};
