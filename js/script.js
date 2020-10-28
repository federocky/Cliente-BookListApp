class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


class UI {

    static displayBooks(){
        
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    }


    static addBookToList (book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(elemento) {
        if(elemento.classList.contains('delete')){
            elemento.parentElement.parentElement.remove();
        }
    }

    static clearFields() {
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        //hacerlo desaparecer

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }
}

class Store {
    static getBooks(){
        let books;

        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}




//Mete los libros al abrir la app
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//agregar un libro
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validacion
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('por favor, rellena todos los campos', 'danger');
    } else {

        //instanciar un libro
        const book = new Book (title, author, isbn);
    
        //lo agregamos a la lista
        UI.addBookToList(book);

        //lo agregamos al store
        Store.addBook(book);
    
        //mostramos mensaje
        UI.showAlert('Libro agregado correctamente', 'success');

        //Clear fields
        UI.clearFields();
    }

})


//quitar un libro
document.querySelector('#book-list').addEventListener('click', (e) => {
    
    //quitarlo de la vista
    UI.deleteBook(e.target);

    //quitarlo de la Storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //mostramos mensaje
    UI.showAlert('Libro eliminado correctamente', 'success');

    
})
