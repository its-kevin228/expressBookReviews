const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js").default;
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "pekpelir"; // Remplace par une clé plus sécurisée en production

// Vérifier si le nom d'utilisateur est valide (existe déjà ou non)
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Vérifier si l'utilisateur est authentifié
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Se connecter (uniquement pour les utilisateurs enregistrés)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
  }

  // Génération du token JWT
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  return res.status(200).json({ message: "Connexion réussie", token });
});

// Middleware pour vérifier l'authentification
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token manquant" });
  }

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token invalide" });
    }
    req.username = decoded.username;
    next();
  });
};

// Ajouter ou modifier un avis sur un livre (utilisateur authentifié uniquement)
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  if (!review) {
    return res.status(400).json({ message: "Le champ 'review' est requis" });
  }

  // Ajouter ou mettre à jour l'avis
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Avis ajouté/modifié avec succès", reviews: books[isbn].reviews });
});

module.exports = {
  isValid,
  authenticatedUser,
  users,
  regd_users // Ajoutez cette ligne pour exporter regd_users
};