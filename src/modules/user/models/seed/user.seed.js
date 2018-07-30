const data = require('./user.data');

module.exports = (seeder) => {
  seeder.seed(data).then((dbRes) => {
    console.log(dbRes);
  });
};
