const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');

function helpers() {
  Handlebars.registerHelper('json', (context) => JSON.stringify(context));
  Handlebars.registerHelper('size', n => {
    const types = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
    let size = n;
    let i = 0;
    while (size >= 1024) {
      size /= 1024;
      i++;
    }
    return `${parseFloat(size).toFixed(2)} ${types[i] || '?'}`;
  })
}

module.exports = function (app) {
  const hbs = exphbs.create({
    extname: '.hbs'
  });

  app.engine(hbs.extname, hbs.engine);
  app.set('view engine', hbs.extname)

  helpers();
}
