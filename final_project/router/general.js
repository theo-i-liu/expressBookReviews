const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } else {
    let msg = ""
    if (!username) msg = "username ";
    if (!password) msg += "password ";
    return res.status(404).json({message: msg + "should not be blank!"});
  }

});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    let myPromise = new Promise((resolve,reject) => {
        try {
            res.send(JSON.stringify(books,null,4));
            resolve("Response was sent.")
        } catch(err) {
            reject(err)
        }
    });
    
    myPromise.then(
        (successMessage) => console.log(successMessage),
        (err) => console.log("Error in responding.")
    );
    
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    let myPromise = new Promise((resolve,reject) => {
        try {
            const isbn = req.params.isbn;
            res.send(books[isbn])
            resolve("Response was sent.")
        } catch(err) {
            reject(err)
        }
    });
        
    myPromise.then(
        (successMessage) => console.log(successMessage),
        (err) => console.log("Error in responding.") 
    );

});
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    try {
        let filtered_books = [];
        for (let key in books) {
            if (books[key]["author"]===req.params.author) 
            filtered_books.push(books[key]);    
        }
        res.send(JSON.stringify(filtered_books,null,4));
        resolve("Response was sent.")
        } catch(err) {
            reject(err)
        }
    });
        
    myPromise.then(
        (successMessage) => console.log(successMessage),
        (err) => console.log("Error in responding.") 
    );

});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    try {
        let filtered_books = [];
        for (let key in books) {
            if (books[key]["title"]===req.params.title) 
            filtered_books.push(books[key]);    
        }
        res.send(JSON.stringify(filtered_books,null,4));
        resolve("Response was sent.")
        } catch(err) {
            reject(err)
        }
    });
        
    myPromise.then(
        (successMessage) => console.log(successMessage),
        (err) => console.log("Error in responding.") 
    );

});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])

});


module.exports.general = public_users;
