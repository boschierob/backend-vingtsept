
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const auth = require("./auth");

const app = express();
const PORT = process.env.PORT || 3333;

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

// require database connection 
const dbConnect = require("./db/dbConnect");

const User = require("./models/userModel");

// execute database connection 
dbConnect();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (request, response, next) => {
    response.json({ message: "Hey! This is your server response!" });
    next();
});


app.post("/register", async (request, response) => {
    const { nom, email, motDePasse, statut } = request.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return response.json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const newUser = new User({
            nom: nom,
            email: email,
            motDePasse: hashedPassword,
            statut: statut
            // Ajoutez d'autres champs si nécessaire
        });

        await newUser.save();
        response.json({ message: `ok new User ${nom} registered` })
        // res.redirect('/login'); // Redirigez l'utilisateur vers la page de connexion après l'inscription réussie
    } catch (error) {
        console.error(error);
        // res.render('register', { message: 'Error during registration' });
        response.json({ message: 'error occured during registering' })
    }
});

app.post('/login', async (request, response) => {
    try {
        const existingUser = await User.findOne({ email: request.body.email });
        if (existingUser) {
            const passwordMatch = await bcrypt.compare(request.body.motDePasse, existingUser.motDePasse);
            
            if (passwordMatch) {
                // Création du jeton JWT
                const token = jwt.sign(
                    {
                        userId: existingUser._id,
                        userEmail: existingUser.email,
                    },
                    "RANDOM-TOKEN",
                    { expiresIn: "24h" }
                );
                response.status(200).send({
                    message: "Login Successful",
                    email: existingUser.email,
                    token,
                });
            } else {
                response.status(401).json({ message: 'Identifiants invalides' });
            }
        } else {
            // Aucun utilisateur trouvé avec l'e-mail fourni
            response.status(401).json({ message: 'Identifiants invalides' });
        }
    } catch (error) {
        console.error(error);
        response.status(500).send({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

app.get("/free-endpoint", (request, response) => {
    response.json({ message: "You are authorized to access me"})
});

app.get("/auth-endpoint", auth, (request, response) => {
    response.json({ message: "You are authorized to access me" });
  });

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
