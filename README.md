# PRWEB : ReactJS + NodeJS + PostgreSQL

----------------------------
## Database Structure

### person
* person_id: integer (primary key) (auto increment)
* person_firstname: varchar
* person_lastname: varchar
* person_birthdate: date
* person_pwd: varchar (defaults to "12345678")

### book
* book_id: integer (primary key) (auto increment)
* book_title: varchar
* book_authors: varchar

### borrow
* person_id: integer (foreign key) 
* book_id: integer (foreign key)
* borrow_date: date
* return_date: date

----------------------------
## Database Routes

* Authentication : /authenticate

* Books : /books
* Book(id): /book/:id
* CREATE a book : /createBook
* DELETE a book : /deleteBook
* UPDATE a book : /updateBook

* Borrows : /borrows
* CREATE a borrow : /createBorrow
* DELETE a borrow : /deleteBorrow
* UPDATE a borrow : /updateBorrow

* GET Users : /users
* GET User(id): /user/:id
* CREATE a user : /createUser
* DELETE a user : /deleteUser
* UPDATE a user : /updateUser

* GET all books that are returned : /availableBooks

* User's borrowed Books : /userBooks/:id
* Borrow a book : /borrowBook
* Return a book : /returnBook

----------------------------
## Commands

`npm start` - Start the app
`npm run sass` - Start SASS (refresh with Ctrl+S)
`nodemon server.js` - Start the server (refresh with Ctrl+S)

----------------------------
## Creative choices

- No classes. Hooks and functions (React > 17)
- Token is a cookie that stays in local storage (not session storage) even after the browser is closed
- Book borrow and return are done from home page (not borrows page, it's just a registry)

USER BOOKS
- User specific books are accessed from the home page (My books) 
- 01/01/1970 is the default date for NULL date
