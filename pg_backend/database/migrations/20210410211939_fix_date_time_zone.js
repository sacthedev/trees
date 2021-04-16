
exports.up = async function(knex) {
  await knex.schema.table('trees', function(table) {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });

  await knex.schema.table('trees', function(table) {
    table.timestamp(
        'created_at',
        {precision: 6, useTz: true},
    ).defaultTo(knex.fn.now(6));
    table.timestamp(
        'updated_at',
        {precision: 6, useTz: true},
    ).defaultTo(knex.fn.now(6));
  });
};

exports.down = function(knex) {
  return knex.schema.table('trees', function(table) {
    table.dropColumn('created_at');
    table.dropColumn('updated_at');
  });
};
