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
      },
      cover: {
          type: DataTypes.STRING
      },
      approved: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      }
    },
    {
        timestamps: false
    }
    );

    Book.rateBook = async function(isbn, userId, rating, review) {
        var book;
        try {
            await sequelize.query('INSERT INTO Reviews VALUES (?, ?, ?, ?);', {replacements: [isbn, userId, rating, review]});
            try {
                book = await Book.findOne({
                        where: {
                            isbn: isbn
                        }
                });
            } catch (err) {
                console.log('couldn\'t find book');
                return false;
            }
            try {
                var updatedRating = (book.rating + Number(rating)) / (Number(book.raters)+1);
                var updatedRaters = Number(book.raters) + 1;
                await Book.update({
                            rating: updatedRating,
                            raters: updatedRaters
                        },
                        {where: {isbn: book.isbn}});
            } catch (err) {
                console.log('couldn\'t update book');
                return false;
            }
            console.log('success');
            return true;
        } catch (err) {
            console.log('could not insert into reviews');
            return false;
        }
    }

    Book.associate = (models) => {
        Book.belongsToMany(models.User, { as: 'User', through: models.UsersBookList, foreignKey: 'isbn'});
    }

    return Book;
}