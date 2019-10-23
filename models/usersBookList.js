module.exports = function(sequelize, DataTypes) {
    var UsersBookList = sequelize.define("UsersBookList", {
        listID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
      id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'if'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      isbn: {
        type: DataTypes.BIGINT,
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