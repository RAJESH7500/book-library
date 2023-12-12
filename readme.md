This project is created using express framework and node.

To run server in the local first just clone this repository and install the dependencies

Once the dependencies have been installed, run the command <b>npm start</b> to start the server and it will run on default port <b>5001</b>

To run the dev server make sure you have the nodemon installed globally and then you can run the <b>npm run dev</b> command to run the development server.

It has 5 different routes

1. Add a new book ->
   endpoint: http://localhost:5001/books <br>
   method: POST <br>
   body: { book} <br>
   response: { data:book_name}<br><br>

2. modify a existing book -> <br>
   endpoint: http://localhost:5001/books<br>
   method: PATCH<br>
   body: { original_book, new_book}<br>
   response: { data:new_book}<br><br>

3. Delete a book -><br>
   endpoint: http://localhost:5001/books?book=book_name<br><br
   method: DELETE<br>
   response: { status:405}<br><br>

4. List all the books joined by comma -><br>
   endpoint: http://localhost:5001/books<br>
   method: GET<br>
   response: { data:'books joined by comma'}<br><br>

5. Update -><br>
   endpoint: http://localhost:5001/books<br>
   method: PUT<br>
   response: { data:'object with key as book name and value is random number which is time taken to process that book'}<br>
