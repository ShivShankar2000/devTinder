const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const requestRoutes = require('./routes/request');  

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/request', requestRoutes);

connectDB().then(() => {
    console.log("DB connected");
    app.listen(3000, () => {
        console.log("Running on server 3000");
    });
}).catch((err) => {
    console.error("DB connection error", err);
})



