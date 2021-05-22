const express = require("express");
const app = express();

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

const port = 3000;

const managers = require('./managers');

app.get("/ping", (req, res) => res.send("pong"));

app.route('/fields')
  .get(async (req, res) => {
    try {
      const fields = await managers.fields.get();
      res.json(fields);
    } catch (e) {
      res.status(500);
    }
  })
  .post(async (req, res) => {
    try {

      const {
        type,
        name,
        required,
        pattern,
        fields,
      } = req.body;

      const field = await managers.fields.create(type, name, required, pattern, fields);
      res.json(field);
    } catch (e) {
      console.log(e)
      res.status((typeof e.status !== 'undefined') ? e.status : 500).send(e);
    }
  });

app.route('/fields/:id')
  .put(async (req, res) => {
    try {
      const {
        type,
        name,
        required,
        pattern,
        fields,
      } = req.body;

      const field = await managers.fields.update(req.params.id, type, name, required, pattern, fields);

      res.json(field);
    } catch (e) {
      res.status((typeof e.status !== 'undefined') ? e.status : 500).send(e);
    }
  })
  .delete(async (req, res) => {
    try {

      const field = await managers.fields.remove(req.params.id);

      res.json(field);
    } catch (e) {
      res.status((typeof e.status !== 'undefined') ? e.status : 500).send(e);
    }
  });

app.route('/forms')
  .post(async (req, res) => {
    try {

      const field = await managers.forms.submit(req.body);
      res.json(field);
    } catch (e) {
      console.log(e);
      res.status((typeof e.status !== 'undefined') ? e.status : 500).send(e);
    }
  });

// app.get("/fields", (req, res) => {
//   knex
//     .from("fields")
//     .select("*")
//     .then((rows) => {
//       res.json(rows);
//     })
//     .catch((err) => {
//       res.status(500);
//     });
// });

app.listen(port, () => console.log("Example app listening on port " + port));