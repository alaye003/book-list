class Book {
  constructor (title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;    
  }
}

class UI {
  // Add book
  addBookToList(book){
    // list
    const list = document.getElementById('book-list');
    // Create element
    const row = document.createElement('tr');
  
    row.innerHTML =  `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  }  

  // Clear field
  clearInputFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  } 

  // Delete book 
  deleteBookFromList (target) {
    if(target.className === 'delete'){
        target.parentElement.parentElement.remove();
    }
  }
  
  //show alert 
  showAlert (message, className) {
    // Create div element
    const div = document.createElement('div');
    
    const parent = document.querySelector('.container');
    const form = document.getElementById('book-form');
    
    // Add class
    div.className = `alert ${className}`;  
    div.textContent = message;
      
    parent.insertBefore(div, form);
  
    setTimeout(()=>{
      document.querySelector('.alert').remove();
    },3000);
  }  
}

// Local Storage Class
class Store {
  // Add book to LS
  static addBook(book){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    }else{
      books = JSON.parse(localStorage.getItem('books'));
    }
    books.push(book);    
    // Set LS
    localStorage.setItem('books', JSON.stringify(books));    
  }

  // deletebook
  static removeBook(isbn){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    }else{    
      books = JSON.parse(localStorage.getItem('books'));
    }    
    books.forEach((book, index)=>{
      if(book.isbn === isbn){
        books.splice(index,1);
      }
    });   
    // Set LS
    localStorage.setItem('books', JSON.stringify(books));  
  }

  static displayBooks(){
    const ui = new UI;
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    }else{    
      books = JSON.parse(localStorage.getItem('books'));
    }  
    books.forEach((book)=>{
      // Add book to ui
      ui.addBookToList(book);
    });  
  }
}

// Event listeners for DOM
document.addEventListener('DOMContentLoaded', Store.displayBooks());

// Event listeners for book-form
document.getElementById('book-form').addEventListener('submit', (e)=>{
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
  
  const book = new Book(title, author, isbn);
  
  const ui = new UI();
  
  // validation
  if(title === '' || author === '' || isbn === ''){
     ui.showAlert('Please fill out all fields', 'error');
  }else{
        
    ui.addBookToList(book);
    
    // Clear  input fields
    ui.clearInputFields();

    // Show success message
    ui.showAlert('Book Added', 'success');

    // Add book to local storage
    Store.addBook(book);
  }
  e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', (e)=>{ 
  // init ui
  const ui = new UI();
  ui.deleteBookFromList(e.target);

  ui.showAlert('Book Removed', 'success');
  
  // Remove book from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  e.preventDefault();
});