const express = require("express");
const session = require("express-session");
const jwt = require("jsonwebtoken");

const customer_routes = require("./router/auth_users").regd_users; // Changez .authenticated en .regd_users
const general_routes = require("./router/general").general;

const app = express();

app.use(express.json());

// Configuration de la session
app.use(session({
    secret: "pekpeli",
    resave: false,
    saveUninitialized: true,
}));

// Middleware d'authentification basé sur la session
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        return res.status(403).json({ message: "Accès interdit. Veuillez vous connecter." });
    }
});

// Routes publiques
app.use("/", general_routes);

// Routes protégées (authentification requise)
app.use("/customer", customer_routes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
