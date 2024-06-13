const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (usersWithSameName && usersWithSameName.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  const user = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (user && user.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(400).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  if (!isbn || !review) {
    return res.status(400).json({ message: "Invalid request" });
  }
  if (!books[isbn]) {
    return res.status(400).json({ message: "Invalid ISBN" });
  }
  const filteredBookReviews = Object.values(books[isbn].reviews).filter((bookReview) => {
    return bookReview.sender === req.user.username;
  });
  if (filteredBookReviews && filteredBookReviews.length > 0) {
    filteredBookReviews[0].review = review;
  } else {
    books[isbn].reviews[req.user.data] = { review };  //req.user.data is the username
  }
  return res.status(200).json({ message: `The review for the book ISBN ${isbn} has been added/updated.` });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  if (!isbn || !books[isbn]) {
    return res.status(400).json({ message: "Invalid ISBN" });
  }
  if (!books[isbn].reviews[req.user.data]) {
    return res.status(400).json({ message: "No review found for the book" });
  }
  delete books[isbn].reviews[req.user.data];
  return res.status(200).json({ message: `The review for the book ISBN ${isbn} has been deleted.` });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
