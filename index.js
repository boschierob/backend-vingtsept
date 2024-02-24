
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
const Intervention = require('./models/interventionModel');

// execute database connection 
dbConnect();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (request, response, next) => {
    response.json({ message: "Hey! This is your server response!" });
    next();
});

app.post("/save-inter", async (req, res) => {
    try {
        // Récupérer le tableau d'interventions de la requête
        const interventions  = req.body;
        //console.log(req.body);

        // Vérifier si le tableau d'interventions est valide
        if (!Array.isArray(interventions)) {
            return res.status(400).json({ success: false, message: 'Invalid request: interventions must be an array' });
        }

        // Enregistrer chaque intervention individuellement
        const savedInterventions = [];
        for (const interventionData of interventions) {
            const newIntervention = new Intervention(interventionData);
            const savedIntervention = await newIntervention.save();
            savedInterventions.push(savedIntervention);
        }

        // Répondre avec un statut de succès et les données des interventions sauvegardées
        res.status(201).json({ success: true, message: 'Interventions saved successfully', interventions: savedInterventions });
    } catch (error) {
        // En cas d'erreur, répondre avec un code d'erreur et le message d'erreur
        res.status(500).json({ success: false, message: 'Failed to save interventions', error: error.message });
    }
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
        response.json({ message: `ok new User ${email} registered` })
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
            const passwordMatch = await bcrypt.compare(request.body.password, existingUser.motDePasse);
            
            if (passwordMatch) {
                // Création du jeton JWT
                const token = jwt.sign(
                    {
                        userId: existingUser._id,
                        userEmail: existingUser.email,
                    },
                     `${process.env.JWSECRET}`,
                    { expiresIn: "1h" }
                );
                response.status(200).send({
                    message: "Login Successful",
                    email: existingUser.email,
                    token,
                });
                console.log(token);
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

app.get("/auth-endpoint",auth, async (request, response) => {
    
    const userId = request.user.userId;

    const user = await User.findById(userId);


    console.log(`user : ${user} `);
    
    response.json({ 
        message: "You are authorized to access me",
        userId: user.id,
        username: user.nom,
        email: user.email,
        statut: user.statut,
        monthlySheets: user.monthlySheets,
        customers : user.customers
    }); 
    
  });

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
