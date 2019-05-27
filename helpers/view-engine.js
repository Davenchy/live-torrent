const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');

function helpers() {
  Handlebars.registerHelper('json', (context) => JSON.stringify(context));
}

module.exports = function (app) {
  const hbs = exphbs.create({
    extname: '.hbs'
  });

  app.engine(hbs.extname, hbs.engine);
  app.set('view engine', hbs.extname)

  helpers();
}
