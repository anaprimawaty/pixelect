// Establish connection to database
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.PIXELECT_STAGING_DATABASE, process.env.PIXELECT_STAGING_USER, process.env.PIXELECT_STAGING_PASSWORD, {
  host: process.env.PIXELECT_STAGING_HOST,
  port: process.env.PIXELECT_STAGING_PORT,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 2,
    idle: 10000
  }
});

// Test connection to database
sequelize
  .authenticate()
  .then(() => {
    console.log('Successfully connected to database.');
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });

// User table
const User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  facebookId: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Group table
const Group = sequelize.define('group', {
});
Group.belongsTo(User, {
  foreignKey: {
    name: 'owner',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

// User-Group table
Group.belongsToMany(User, {through: 'UserGroup'});
User.belongsToMany(Group, {through: 'UserGroup'});

// API stuff for future
// To create User
// User.create({
//   firstName: 'Ana',
//   lastName: 'Chua',
//   facebookId: '123'
// });

// To create Group
// Group.create({
//   owner: 1
// });

// To add User to Group
// User.findById(3).then(user => {
//   Group.findById(1).then(group => {
//     user.setGroups([group]);
//   });
// });