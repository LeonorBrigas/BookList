// Book Class: Represents a Book
// this isnt static, so we need to instatiate a book to get a book
class Book {
  // method that runs when we instatiate a book
  constructor(title, author, isbn) {
    // whatever passes in as params will be assigned to title, author, isbn
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  addBookToList(book) {
    const list = document.querySelector('#book-list');
    // create table row
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">x</a></td>
    `

    // append row to the list
    list.appendChild(row);
  }

  // className can be danger, primary, success
  showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    // to pass text => TextNode
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // parent element => container
    container.insertBefore(div, form);

    // vanish in 3 seconds => 3000 miliseconds (to not show many alerts)
    setTimeout(() => {
      document.querySelector('.alert').remove();}, 3000);
  }

  deleteBook(el) {
  // to see if a class is included
  if(el.className === 'delete') {
    // go up and delete from title row
    el.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    // clear fields after submitting
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

// Store Class: Handles Local Storage (key value pairs - it has to be a string to save in local storage)
// (not related to UI anymore)
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
       // problem it will be returned as string
      // solution => JSON.parse => to be a regular JS array of objects
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => {
      const ui = new UI();
      ui.addBookToList(book);
    })
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    console.log(isbn);
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        // remove => splice (use index)
        books.splice(index, 1);
      }
    });
    // reset local storage with that book remover
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event: Display Books
// as soon as the DOM is loaded it will display the books
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {

  // get form values
  const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;

  // instatiate a book
  const book = new Book(title, author, isbn);

  // instantiate UI
  const ui = new UI();

  // validate
  if(title === '' || author === '' || isbn === '') {
    ui.showAlert('Please fill in all fields', 'error');
  } else {

    // Show success message
    ui.showAlert('Book Added', 'success');

    // Add Book to UI
    ui.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Clear fields
    ui.clearFields();
    }
    // Prevent actual submit
    // because it is a submit event we need to prevent the default value
    e.preventDefault();
  });


// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  const ui = new UI();

  // Remove book from UI
  ui.deleteBook(e.target);

  // Remove book from a store
  // parentElement because is going to be the td
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show alert - success message
  ui.showAlert('Book Removed', 'success');
  e.preventDefault();
});

