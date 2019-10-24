module.exports = function(sequelize, DataTypes) {
    var UsersBookList = sequelize.define("UsersBookList", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'User',
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      isbn: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        references: {
          model: 'Book',
          key: 'isbn'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }
    },
    {
        timestamps: false
    }
    );
    UsersBookList.associate = (models) => {
        UsersBookList.belongsTo(models.User, { foreignKey: 'id', targetKey: 'id', as: 'User' });
        UsersBookList.belongsTo(models.Book, { foreignKey: 'isbn', targetKey: 'isbn', as: 'Book' });
    }
    return UsersBookList;
}