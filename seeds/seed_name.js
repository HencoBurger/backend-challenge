exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("fields")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("fields").insert([{
          id: 1,
          type: "text",
          name: "firstName",
          required: true
        },
        {
          id: 2,
          type: "text",
          name: "lastName",
          required: true
        },
        {
          id: 3,
          type: "date",
          name: "dob",
          required: true
        },
        {
          id: 4,
          type: "email",
          name: "email",
          pattern: "[a-z0-9.]+@[a-z0-9.]+.com"
        },
        {
          id: 5,
          type: "group",
          name: "emergencyContact",
          fields: JSON.stringify([1, 2, 4])
        }
      ]);
    });
};