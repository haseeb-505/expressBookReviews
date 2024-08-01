const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username) => { 
    return username.length > 0;
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    return users.some((user) => user.username === username && user.password === password);
}

// Login endpoint
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = { accessToken, username };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.body.review; // access the review given in the body
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (!review) {
        return res.status(400).json({ message: "Review is missing!" });
    }

    if (!username) {
        return res.status(400).json({ message: "username is missing!" });

    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found!" });
    }

    // Add or modify the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: `Review added/updated for book with ISBN ${isbn}` });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (!username) {
        return res.status(400).json({ message: "User not logged in!" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found!" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this book!" });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: `Review deleted for book with ISBN ${isbn}` });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
