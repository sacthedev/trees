exports.up = function (knex) {
  return knex.schema.createTable("trees", function (table) {
    table.increments();
    table.string("common_name");
    table.string("scientific_name");
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("trees");
};
