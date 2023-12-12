const books = require("../data/books-data");

// Helper function to join the books by given separator
const getBookList = async (
  list,
  index,
  callback,
  separator,
  accumulator = ""
) => {
  if (index < list.length) {
    const currentBook = list[index];
    const bookInfo = currentBook + separator;
    const updatedAccumulator = accumulator + bookInfo;
    await getBookList(list, index + 1, callback, separator, updatedAccumulator);
  } else {
    callback(accumulator);
  }
};

// Function to get the final book list
const list = async (req, res) => {
  let result = "";
  await getBookList(books, 0, (output) => (result = output), ", ");
  res.json({ data: result });
};

// Helper function to return the delay to process a single book name
const saveItemOnDatabase = (name, callback) => {
  const delay = Math.random() * name.length * 100;
  const intervalId = setInterval(() => {
    clearInterval(intervalId);
    callback(delay);
  }, delay);
};

async function saveBooksToDatabase(bookList) {
  const savedBooks = {};

  // loop through each book in the list and save them database
  for (const book of bookList) {
    await new Promise((resolve) => {
      saveItemOnDatabase(book, (delay) => {
        savedBooks[book] = delay;
        resolve();
      });
    });
  }

  // Return the response containing the time elapsed for each book
  return savedBooks;
}

// function to return the list of books as a key value pair with name and time
const processBooks = async (req, res) => {
  const savedBooks = await saveBooksToDatabase(books);
  res.json({ data: savedBooks });
};

// Middleware function to check if body has book
const bodyHasBook = (req, res, next) => {
  const { book } = req.body;
  if (book) {
    return next();
  }
  next({
    status: 400,
    message: `Must include a book`,
  });
};

// function to to create a new book
const create = (req, res) => {
  const { book } = req.body;
  books.push(book);
  res.status(201).json({ data: book });
};

// function to validate both old and new book before updating
const checkBook = (req, res, next) => {
  const { original_book, new_book } = req.body;
  const findOriginalBook = books.find((book) => book === original_book);
  const findNewBook = books.find((book) => book === new_book);
  if (findNewBook) {
    return next({
      status: 400,
      message: `book with name ${new_book} already exists`,
    });
  }
  if (!findOriginalBook) {
    return next({
      status: 404,
      message: `Book not found with name ${original_book}`,
    });
  }
  next();
};

// function to update the old book with new book.
const update = (req, res) => {
  const { original_book, new_book } = req.body;
  const index = books.indexOf(original_book);
  books[index] = new_book;
  res.json({ data: new_book });
};

// Middleware function to validate the book by name.
const bookExists = (req, res, next) => {
  const { book } = req.query;
  const foundBook = books.find((bookName) => bookName === book);
  if (foundBook) {
    return next();
  }
  next({
    status: 404,
    message: `Book with name ${book} not found`,
  });
};

// function to delete the book from books array.
const destroy = (req, res) => {
  const { book } = req.query;
  const index = books.indexOf(book);
  books.splice(index, 1);
  res.sendStatus(405);
};

module.exports = {
  list,
  create: [bodyHasBook, create],
  delete: [bookExists, destroy],
  update: [checkBook, update],
  processBooks,
};
