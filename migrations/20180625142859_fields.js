exports.up = function(knex, Promise) {
  return knex.schema.createTable("fields", function(table) {
    table.increments("id").primary();
    table.string("name").unique();
    table.string("type");
    table.boolean("required");
    table.string("pattern");
    table.json("fields");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("fields");
};
