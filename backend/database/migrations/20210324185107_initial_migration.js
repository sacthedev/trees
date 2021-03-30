exports.up = function (knex) {
  return knex.schema.createTable("trees", function (table) {
    table.increments().notNullable();
    table.timestamp("created_at").notNullable().defaultTo(Date.now());
    table.timestamp("updated_at").notNullable().defaultTo(Date.now());
    table.string("common_name");
    table.string("scientific_name");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("trees");
};
