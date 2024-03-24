# PRWEB : ReactJS + NodeJS
### Sacha Cruz

---

**IMPORTANT**

J'ai changé un peu la structure du site car j'avais mal compris l'énoncé des TP, et cela me paraissait plus logique :
- La page Borrows montre TOUS les emprunts par tous les utilisateurs, c'est un registre
- La page Home permet d'acceder a la page de "Mes emprunts" et "Emprunter un livre" meme ci la deuxieme fonctionnalité est aussi presente dans la page User

----------------------------
## Database Structure

### person
* **person_id**: integer (primary key) (auto increment)
* **person_firstname**: varchar
* **person_lastname**: varchar
* **person_birthdate**: date
* **person_pwd: varchar** (defaults to "12345678")

### book
* **book_id**: integer (primary key) (auto increment)
* **book_title**: varchar
* **book_authors**: varchar

### borrow
* **person_id**: integer (foreign key) 
* **book_id**: integer (foreign key)
* **borrow_date**: date
* **return_date**: date

----------------------------
## Database Routes

LOGIN
* Authentication : /authenticate

BOOK
* Books : /books
* Book(id): /book/:id
* CREATE a book : /createBook
* DELETE a book : /deleteBook
* UPDATE a book : /updateBook

BORROW
* Borrows : /borrows
* CREATE a borrow : /createBorrow
* DELETE a borrow : /deleteBorrow
* UPDATE a borrow : /updateBorrow

USER
* GET Users : /users
* GET User(id): /user/:id
* CREATE a user : /createUser
* DELETE a user : /deleteUser
* UPDATE a user : /updateUser

SPECIAL
* GET all books that are returned : /availableBooks
* User's HISTORY OF   borrowed Books : /userBooks/:id    (shows returned and not returned)
* User's NOT RETURNED borrowed Books : /userBorrows/:id
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
