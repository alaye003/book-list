function Book(title, author, isbn){
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

function UI(){}

// Add book to list
UI.prototype.addBookToList = (book)=>{
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

// Add book to local storage
UI.prototype.addBookToLS = (book) =>{
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

// Display books to UI
UI.prototype.displayBooks = () => {
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

// Remove book to local storage
UI.prototype.removeBookFromLS = (isbn) =>{
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

// Clear fil
UI.prototype.clearInputFields = ()=>{
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
} 

UI.prototype.deleteBook = (target) =>{
  if(target.className === 'delete'){
      target.parentElement.parentElement.remove();
  }
}

UI.prototype.showAlert = (message, className) =>{
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

// Event listeners for DOM
document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI;
  ui.displayBooks();
});

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
    ui.addBookToLS(book);    
  }
  e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', (e)=>{
  // init ui
  const ui = new UI();
  ui.deleteBook(e.target);

  ui.showAlert('Book Removed', 'success');
  
  // Remove book from LS
  ui.removeBookFromLS(e.target.parentElement.previousElementSibling.textContent);

  e.preventDefault();
});