const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const axios = require('axios');
require('dotenv').config();

const app = express();

// Configuração da sessão
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true
}));

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuração da estratégia de autenticação do Passport com o Spotify
passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_CALLBACK_URL
}, (accessToken, refreshToken, expiresIn, profile, done) => {
    // Aqui você pode salvar os tokens e o perfil do usuário no banco de dados
    return done(null, profile);
}));

// Serialização e desserialização do usuário
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Rota de autenticação com o Spotify
app.get('/auth/spotify', passport.authenticate('spotify'));

// Callback do Spotify após a autenticação
app.get('/auth/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
    // Redireciona o usuário de volta para o cliente React
    res.redirect(process.env.REACT_CLIENT_URL);
});

// Rota para obter informações do usuário autenticado
app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        // Retorna as informações do usuário
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Usuário não autenticado' });
    }
});

// Rota para adicionar uma música à playlist
app.post('/api/playlist/add', (req, res) => {
    // Implemente a lógica para adicionar uma música à playlist aqui
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
