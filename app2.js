const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('ratelimit');
const compression = require('compression');


const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later'
});

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(rateLimit());

let nextID = 3

let books = [
    { "id": 1, "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "isRead": true, "year": 1999 },
    { "id": 2, "title": "The Book of life", "author": "O. Fred Donald", "isRead": !true, "year": 2017 }
]

app.get('/', (req, res) => {
    res.json(books);
}); 

app.get("/:title", (req, res) => {
    const bookname = req.params.title;
    
    const bookData = books.find(item => item.title.toLowerCase() === bookname.toLowerCase());
    if (bookData) {
        res.json(bookData);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
})

app.put("/:title", (req, res) => {
    const bookname = req.params.title;
    const bookData = books.find(item => item.title.toLowerCase() === bookname.toLowerCase());

    if (bookData) {
        const { id, ...updates } = req.body;
        Object.assign(bookData, updates);
        res.json(bookData);

    } else {
        res.status(404).json({ error: "Book not found" });
    }
});

function validateYear(req, res, next) {
    const year = req.body.year;
    if (year && (typeof year !== 'number' || year < 0 || year > new Date().getFullYear())) {
        return res.status(400).json({ error: "Invalid year" });
    }
    next();
}

app.post("/", validateYear, (req, res) => {
    const { title, author, isRead, year } = req.body;

    if (!title || !author || typeof isRead !== 'boolean' || !year) {
        return res.status(400).json({ error: "Invalid book data" });
    }
    
    const book = {
        id: nextID++,
        title,
        author,
        isRead,
        year
    };




    books.push(book); 
    res.status(201).json(book);
});

app.delete("/:books", (req, res) => {
    const bookname = req.params.books;
    const bookIndex = books.findIndex(item => item.title.toLowerCase() === bookname.toLowerCase());
    if (bookIndex !== -1) {
        const deletedBook = books.splice(bookIndex, 1)[0];
        res.json(deletedBook);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
});


app.listen(4000, () => {
    console.log('Server is running on port localhost:4000');
});