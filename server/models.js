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
    allowNull: false,
    unique: true
  }
});

// Group table
const Group = sequelize.define('group', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  hash: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});
Group.belongsTo(User, {
  foreignKey: {
    name: 'owner',
    allowNull: false
  },
  onDelete: 'RESTRICT'
});

// User-Group table
const UserGroup = sequelize.define('userGroup', {
});
Group.belongsToMany(User, {as: 'Members', through: 'userGroup'});
User.belongsToMany(Group, {as: 'Groupings', through: 'userGroup'});

// Photo table
const Photo = sequelize.define('photo', {
  link: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});
Photo.belongsTo(User, {
  foreignKey: {
    allowNull: false
  },
  as: 'photoOwner',
  onDelete: 'RESTRICT'
});
Photo.belongsTo(Group, {
  foreignKey: {
    allowNull: false
  },
  as: 'photoGroup',
  onDelete: 'RESTRICT'
});

// Vote table
const Vote = sequelize.define('vote', {
  isValid: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});
Photo.belongsToMany(User, {as: 'voters', through: 'vote'});
User.belongsToMany(Photo, {as: 'votePhotos', through: 'vote'});

// Exports
module.exports.User = User;
module.exports.Group = Group;
module.exports.UserGroup = UserGroup;
module.exports.Photo = Photo;
module.exports.Vote = Vote;
module.exports.sequelize = sequelize;

// sequelize.sync();

// // API stuff for future
// // To create User
// User.create({
//   firstName: 'Ana',
//   lastName: 'Chua',
//   facebookId: '123'
// });
// User.create({
//   firstName: 'Benny',
//   lastName: 'Chua',
//   facebookId: '456'
// });

// // To create Group
// Group.create({
//   owner: 1,
//   hash: "testhash123"
// });

// // To add User to Group
// User.findById(1).then(user => {
//   Group.findById(1).then(group => {
//     user.addGroupings(group);
//   });
// });
// User.findById(2).then(user => {
//   Group.findById(1).then(group => {
//     user.addGroupings(group);
//   });
// });

// // To create Photo
// Photo.create({
//   link: 'http://blahblah',
//   userId: 1,
//   groupId: 1
// });

// To create Vote
// Vote.create({
//   userId: 1,
//   photoId: 1,
//   isValid: false
// });
// Vote.create({
//   userId: 2,
//   photoId: 1
// });