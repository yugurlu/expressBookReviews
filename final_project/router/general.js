const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  if (isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
  } else {
    return res.status(400).json({ message: "User already exists" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (!isbn || !books[isbn]) {
    return res.status(400).json({ message: "Invalid ISBN" });
  } else {
    return res.status(200).json({ book: books[isbn] });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;
  if (!author) {
    return res.status(400).json({ message: "Invalid author" });
  }
  const booksByAuthor = Object.values(books).filter((book) => {
    return book.author === author;
  });
  if (booksByAuthor && booksByAuthor.length > 0) {
    return res.status(200).json({ books: booksByAuthor });
  } else {
    return res.status(400).json({ message: "No books found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  if (!title) {
    return res.status(400).json({ message: "Invalid title" });
  }
  const booksByTitle = Object.values(books).filter((book) => {
    return book.title === title;
  });
  if (booksByTitle && booksByTitle.length > 0) {
    return res.status(200).json({ books: booksByTitle });
  } else {
    return res.status(400).json({ message: "No books found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (!isbn || !books[isbn]) {
    return res.status(400).json({ message: "Invalid ISBN" });
  }
  if (!books[isbn].reviews) {
    return res.status(400).json({ message: "No reviews found" });
  }
  return res.status(200).json({ reviews: books[isbn].reviews });
});


function getBookListWithPromise(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

async function getBookListAsync(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

//Task-10
public_users.get("/promise", function (req, res) {
  try {
    getBookListWithPromise("http://localhost:5000/")
      .then((bookList) => {
        res.json(bookList);
      })
      .catch((error) => {
        console.error(error.message);
        res.status(500).json({ message: "Error retrieving book list" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});

//Task-10
public_users.get("/async", async function (req, res) {
  try {
    const bookList = await getBookListAsync("http://localhost:5000/"); 
    res.json(bookList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Task-11
public_users.get("/promise/isbn/:isbn", function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    getBookListWithPromise("http://localhost:5000/isbn/" + requestedIsbn)
      .then((book) => {
        res.json(book);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});
// Task-11
public_users.get("/async/isbn/:isbn", async function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    const book = await getBookListAsync(
      "http://localhost:5000/isbn/" + requestedIsbn
    );
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Task-12
public_users.get("/promise/author/:author", function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    getBookListWithPromise("http://localhost:5000/author/" + requestedAuthor)
      .then((book) => {
        res.json(book);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});
// Task-12
public_users.get("/async/author/:author", async function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    const book = await getBookListAsync(
      "http://localhost:5000/author/" + requestedAuthor
    );
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Task-13
public_users.get("/promise/title/:title", function (req, res) {
  try {
    const requestedTitle = req.params.title;
    getBookListWithPromise("http://localhost:5000/title/" + requestedTitle)
      .then((book) => {
        res.json(book);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error" });
  }
});
// Task-13
public_users.get("/async/title/:title", async function (req, res) {
  try {
    const requestedTitle = req.params.title;
    const book = await getBookListAsync(
      "http://localhost:5000/title/" + requestedTitle
    );
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

module.exports.general = public_users;
