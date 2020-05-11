const { UUIDV4 } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("Project", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4()
    },
    code: {
      type: DataTypes.STRING,
    },
  });

  return User;
};
