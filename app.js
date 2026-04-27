const express = require('express');
const morgan = require('morgan');
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");


const app = express();
app.use(rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10 // limit each IP to 10 requests per windowMs
}));

app.use(morgan('dev'));
app.use (express.json());
app.use(helmet());
app.use(express.static("public"));

app.get('/books', (req, res) => {
    const { read } = req.query; 

    if (read !== undefined) {
        const isRead = read === 'true'; 
        const filteredBooks = books.filter(b => b.isRead === isRead);
        return res.json(filteredBooks);
    }

    res.json(books);
});
let books = [
    { "id": 1, "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "isRead": true, "year": 1999 },
    { "id": 2, "title": "The Book of life", "author": "O. Fred Donald", "isRead": !true, "year": 2017 }
]

app.get("/books/:title", (req, res) => {
    const bookname = req.params.title;
    
    const bookData = books.find(item => item.title.toLowerCase() === bookname.toLowerCase());
    if (bookData) {
        res.json(bookData);
    } else {
        res.status(404).json({ error: "Book not found" });
    }
})

const handleErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


app.put("/books/:title",

    // 🟢 VALIDATION RULES (OPTIONAL FIELDS)
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),

    body("author").optional().trim().notEmpty().withMessage("Author cannot be empty"),

    body("isRead").optional().isBoolean().withMessage("isRead must be boolean").toBoolean(),

    body("year").optional().isInt({ min: 0, max: new Date().getFullYear() }).withMessage("Invalid year"),


    handleErrors,

    // 🟢 ROUTE LOGIC
    (req, res) => {
        const bookname = req.params.title;

        const bookData = books.find(
            item => item.title.toLowerCase() === bookname.toLowerCase()
        );

        if (!bookData) {
            return res.status(404).json({ error: "Book not found" });
        }

        const { id, ...updates } = req.body;

        Object.assign(bookData, updates);

        res.json(bookData);
    }
);


app.post("/books",

    // 🟢 RULES (middleware)
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("author").trim().notEmpty().withMessage("Author is required"),
    body("isRead").isBoolean().withMessage("isRead must be boolean").toBoolean(),
    body("year").isInt({ min: 0, max: new Date().getFullYear() }).withMessage("Year must be a valid integer").toInt(),

    handleErrors,

    // 🟢 CHECK ERRORS
    (req, res) => {

        // 🟢 NORMAL LOGIC
        const { title, author, isRead, year } = req.body;

        const book = {
            id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
            title,
            author,
            isRead,
            year
        };

        books.push(book);
        res.status(201).json(book);
    }
);


app.delete("/books/:title", (req, res) => {
    const bookname = req.params.title;
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