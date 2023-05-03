const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));


const requireAuth = (req, res, next) =>{
    const sessionID = req.cookies.sessionID;
    if(sessionID){
        req.user = {name: "elijah", role: 'admin'}
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/login', (req,res) => {
    res.send(`
    <form method="post" action="/login">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username"/><br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password"><br>
        <input type="submit" value="Log in">
    </form>
    `)
});

app.post('/login', (req,res)=>{
    const {username, password} = req.body;

    if(username === 'admin' && password === 'password'){
        const sessionID = generateSessionID();
        res.cookie('sessionID', sessionID, {httpOnly: true});
        res.redirect('/dashboard');
    } else{
        res.send('Invalid username or password');
    }
});

app.get('/dashboard', requireAuth, (req,res)=>{
    const user = req.user;
    res.send(`Welcome, ${user.name}!`);
});

app.get('/logout', (req,res)=>{
    res.clearCookie('sessionID');
    res.redirect('/login');
});

const generateSessionID = () => {
    return Math.random().toString(36).slice(2);
}

app.listen(3000, () =>{
    console.log("LISTENING...");
})