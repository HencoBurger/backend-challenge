exports.up = function(knex, Promise) {
  return knex.schema.createTable("forms", function(table) {
    table.increments("id").primary();
    table.integer("form_id");
    table.string("key");
    table.json("value");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("forms");
};
