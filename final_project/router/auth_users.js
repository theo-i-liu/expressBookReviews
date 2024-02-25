const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return false;
    } else {
      return true;
    }
}


const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  if (books[isbn]){
    if (books[isbn]["reviews"][username]) {
      books[isbn]["reviews"][username] = req.body.review;
      return res.status(200).send("The review of [" + books[isbn]["title"]+ "] has been updated by " + username );
    }
    else{
      books[isbn]["reviews"][username] = req.body.review;
      return res.status(200).send("The review of [" + books[isbn]["title"]+ "] has been added by " + username );
    }
  } else {
    return res.status(403).json({message: "The book with ISBN["+isbn+"] was not found!"})
  }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization['username'];
  const isbn = req.params.isbn;
  if (books[isbn]){
    if (books[isbn]["reviews"][username]) {
      delete books[isbn]["reviews"][username];
      return res.status(200).send("The review of (" + books[isbn]["title"]+ ") by " + username + " has been deleted." );
    }
    else{
      return res.status(404).send("The review of (" + books[isbn]["title"]+ ") by " + username + " was not found.");
    }
  } else {
    return res.status(403).json({message: "The book with ISBN["+isbn+"] was not found!"})
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
