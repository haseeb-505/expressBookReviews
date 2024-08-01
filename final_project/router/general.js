const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if (!doesExist(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}



// Get the book list available in the shop

// const apiUrl = 'https://hatahir87626-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/customer/';

public_users.get('/',async (req, res) => {
    try {
    //   const response = await axios.get('http://localhost:5000/');
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
  });

  //Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.
// Get book details based on ISBN

public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const filtered_books = Object.entries(books)
      .filter(([id, book]) => id === isbn)
      .reduce((acc, [id, book]) => {
        acc[id] = book;
        return acc;
      }, {});

    if (Object.keys(filtered_books).length === 0) {
      reject('No books found with this ISBN');
    } else {
      resolve(filtered_books);
    }
  })
    .then(filtered_books => {
      res.status(200).json({ books: filtered_books });
    })
    .catch(error => {
      res.status(404).json({ message: error });
    });
});


// public_users.get('/isbn/:isbn', async (req, res) => {
//     const isbn = req.params.isbn;
//     try {
//       // Filter books based on ISBN
//       let filtered_books = Object.entries(books)
//         .filter(([id, book]) => id === isbn)
//         .reduce((acc, [id, book]) => {
//           acc[id] = book;
//           return acc;
//         }, {});
//       res.status(200).json({ books: filtered_books });
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching book details', error: error.message });
//     }
//   });

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.trim().toLowerCase();
    try {
      const filtered_books = Object.entries(books)
        .filter(([id, book]) => book.author.trim().toLowerCase() === author)
        .reduce((acc, [id, book]) => {
          acc[id] = book;
          return acc;
        }, {});
      if (Object.keys(filtered_books).length === 0) {
        return res.status(404).json({ message: `No books found by this author: ${author}` });
      }
      res.status(200).json({ books: filtered_books });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books by author', error: error.message });
    }
  });


// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.trim().toLowerCase();
    try {
      const filtered_books = Object.entries(books)
        .filter(([id, book]) => book.title.trim().toLowerCase() === title)
        .reduce((acc, [id, book]) => {
          acc[id] = book;
          return acc;
        }, {});
      if (Object.keys(filtered_books).length === 0) {
        return res.status(404).json({ message: `No books found by this title: ${title}` });
      }
      res.status(200).json({ books: filtered_books });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books by author', error: error.message });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let filtered_books = Object.entries(books)
                        .filter(([id, book]) => id === isbn)
                        .reduce((acc, [id, book]) =>{
                            acc[id] = book;
                            return acc;
                        }, {})
  return res.status(300).json({book_review: `Review of the book ${filtered_books[isbn].title}, (ISBN: ${isbn}) is: ${JSON.stringify(filtered_books[isbn].reviews, null, 2)}`});
});

module.exports.general = public_users;
