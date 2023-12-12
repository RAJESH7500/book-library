const request = require("supertest");
const books = require("../src/data/books-data");
const booksRouter = require("../src/books/books.router");
const makeTestApp = require("./make-test-app");

const ATTACHED_PATH = "/books";

const app = makeTestApp(ATTACHED_PATH, booksRouter);

describe("books router", () => {
  beforeEach(() => {
    books.splice(0, books.length);
  });

  describe("create method", () => {
    test("creates a new book", async () => {
      const expectedName = "my book";
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({
          book: "my book",
        });
      expect(response.body.error).toBeUndefined();
      expect(response.body.data).not.toBeUndefined();
      expect(response.body.data).toEqual(expectedName);
      expect(response.status).toBe(201);
      expect(books.find((book) => book === expectedName)).not.toBeUndefined();
    });

    test("returns 400 if book is missing", async () => {
      const response = await request(app)
        .post(ATTACHED_PATH)
        .set("Accept", "application/json")
        .send({});
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toContain("book");
      expect(response.status).toBe(400);
    });
  });

  describe("patch method", () => {
    test("returns 404 if book does not exist", async () => {
      const data = { original_book: "test", new_book: "new_test" };

      const response = await request(app)
        .patch(`${ATTACHED_PATH}`)
        .set("Accept", "application/json")
        .send(data);

      expect(response.body.error).not.toBeUndefined();
      expect(response.status).toBe(404);
      expect(response.body.error).toContain(data.original_book);
    });
    test("returns 400 if new book already exist", async () => {
      const data = { original_book: "test", new_book: "new_test" };
      books.push("new_test");
      books.push("test");
      const response = await request(app)
        .patch(`${ATTACHED_PATH}`)
        .set("Accept", "application/json")
        .send(data);
      expect(response.body.error).not.toBeUndefined();
      expect(response.status).toBe(400);
      expect(response.body.error).toContain(data.original_book);
    });

    test("updates original book with new book", async () => {
      const data = { original_book: "test", new_book: "new_test" };

      books.push(data.original_book);

      const expected = data.new_book;

      const response = await request(app)
        .patch(`${ATTACHED_PATH}`)
        .set("Accept", "application/json")
        .send(data);

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(expected);
      expect(response.status).toBe(200);
    });
  });

  describe("delete method", () => {
    test("delete exiting book and return 405 status code", async () => {
      const original_book = "test_book";
      books.push(original_book);

      const response = await request(app)
        .delete(`${ATTACHED_PATH}?book=${original_book}`)
        .set("Accept", "application/json");
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBeUndefined();
      expect(response.status).toBe(405);
    });

    test("returns 404 for non-existent book", async () => {
      const original_book = "test_book";
      const response = await request(app)
        .delete(`${ATTACHED_PATH}?book=${original_book}`)
        .set("Accept", "application/json");

      expect(response.body.data).toBeUndefined();
      expect(response.status).toBe(404);
      expect(response.body.error).toContain(original_book);
    });
  });

  describe("list method", () => {
    test("returns list of books join by comma", async () => {
      const expected = "book1, book2, book3, book4, ";
      const newBooks = ["book1", "book2", "book3", "book4"];

      books.push(...newBooks);

      const response = await request(app)
        .get(ATTACHED_PATH)
        .set("Accept", "application/json");

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(expected);
      expect(response.status).toBe(200);
    });
  });
  describe("update method", () => {
    test("returns books object with key to book name and value to time delay", async () => {
      const newBooks = ["book1", "book2", "book3", "book4"];

      books.push(...newBooks);

      const response = await request(app)
        .put(ATTACHED_PATH)
        .set("Accept", "application/json");
      console.log("first response", response.body);
      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual({
        book1: expect.any(Number),
        book2: expect.any(Number),
        book3: expect.any(Number),
        book4: expect.any(Number),
      });
      expect(response.status).toBe(200);
    });
  });
});
