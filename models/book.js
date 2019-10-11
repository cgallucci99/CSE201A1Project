module.exports = function(sequelize, DataTypes) {
    var Book = sequelize.define("Book", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false
      },
      publicationYear: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      synopsis: {
          type: DataTypes.STRING(500),
          allowNull: false
      },
      genre1: {
          type: DataTypes.INTEGER,
      },
      genre2: {
          type: DataTypes.INTEGER
      },
      pageCount: {
          type: DataTypes.INTEGER
      },
      rating: {
          type: DataTypes.FLOAT
      },
      raters: {
          type: DataTypes.INTEGER
      },
      isbn: {
          type: DataTypes.BIGINT,
          primaryKey: true
      }
    },
    {
        timestamps: false
    }
    );
    return Book;
}