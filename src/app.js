const express = require("express");
const booksRouter = require("./books/books.router");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

// definining express application
const app = express();

app.use(express.json());
app.use("/books", booksRouter);

// defining error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
