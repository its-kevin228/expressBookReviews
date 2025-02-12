const express = require('express');
let books = require("./booksdb.js").default;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Enregistrement d'un nouvel utilisateur
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
  }

  if (users[username]) {
    return res.status(400).json({ message: "Utilisateur déjà enregistré" });
  }

  users[username] = { password };
  return res.status(201).json({ message: "Utilisateur enregistré avec succès !" });
});

// Obtenir la liste des livres disponibles
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Obtenir un livre par son ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  return res.status(200).json(book);
});

// Obtenir un livre par son auteur
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author);

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "Aucun livre trouvé pour cet auteur" });
  }

  return res.status(200).json(booksByAuthor);
});

// Obtenir un livre par son titre
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title);

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "Aucun livre trouvé avec ce titre" });
  }

  return res.status(200).json(booksByTitle);
});

// Obtenir les avis d'un livre
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  return res.status(200).json(book.reviews);
});

// Récupérer la liste de tous les livres disponibles
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

module.exports.general = public_users;
