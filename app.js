const express = require('express')
const pug = require('pug');
const path = require("path");
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const fs = require('fs');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

const port = process.env.PORT || 3000

// Setting our view engine to pug
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(cookieParser())
app.use(session({ resave: false, saveUninitialized: true, secret: 'MySecret' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var sess; //for session storage

app.use(express.static(path.join(__dirname + "/public")))

var globalSocket = new Set();
var adminsocket = null;

// here we ask for username
app.get('/', (req, res) => {
    res.render("index");
})

logger = (data, level) => {
    date = new Date();
    if (level == 'DEBUG')
        data = date + ':' + 'DEBUG' + ':' + data + '\n'
    else if (level == 'INFO')
        data = date + ':' + 'INFO' + ':' + data + '\n'
    else
        data = date + ':' + 'DEBUG' + ':' + data + '\n'

    fs.writeFileSync('logged.log', data, { flag: 'a' })
}

io.on('connection', (socket) => {
    globalSocket.add(socket);
    socket.on('username', (name, id) => {
        socket.username = name;
        console.log("User Connected: ", socket.id, "username: ", name);
        logger("User Connected: " + socket.id + " username: " + name + " Connected Users: " + globalSocket.size, 'INFO');
        if (adminsocket)
            adminsocket.emit('usernameid', name, socket.id);
    });
    socket.on('bingoKey', id => {
        if (adminsocket)
            adminsocket.emit('bingoKey', id);
    })
    socket.once('disconnect', function () {
        globalSocket.delete(socket); " Connected Users: " + globalSocket.size
        logger("User Disconnected: " + socket.id + " username: " + socket.username + " Connected Users: " + globalSocket.size, 'DEBUG');
        if (adminsocket)
            adminsocket.emit('userdisconnected', socket.id);
    });
});

// here we go to game page 
app.get('/Game', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/Game/index.html"))
})

app.get('/GameNoBlock', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/GameNoBlock/index-noblock.html"))
})

// everything Admin

const adminIO = io.of("/admin");
adminIO.on("connection", socket => {
    adminsocket = socket;
    console.log("admin ID", socket.id, "username: ", socket.username);
    logger("admin ID: " + socket.id + " username: " + socket.username, 'INFO');
})

adminIO.use((socket, next) => {
    if (socket.handshake.auth.token == 'nitinz') {
        socket.username = "nitin";
        socket.on('admin-sent', msgs => {
            logger('admin-sent: ' + msgs, 'DEBUG');
            if (globalSocket)
                globalSocket.forEach(userSock => userSock.emit('game-number', msgs));
        })
        next()
    }
    else {
        next(new Error("Please send token"))
    }
})

// everything with admin IO ends

app.get('/adminLogin', function (req, res) {
    sess = req.session;
    //Session set when user Request our app via URL
    if (sess.email) {

        if (sess.email != 'nitin') {
            res.render('adminLogin', { errormessage: `Failed to login.` });
            return;
        }
        res.redirect('/admin');
    }
    else {
        res.render('adminLogin');
    }
});

app.post('/login', function (req, res) {
    sess = req.session;
    //In this we are assigning email to sess.email variable.
    //email comes from HTML page.
    sess.email = req.body.email;
    res.redirect('/adminLogin');
});

app.get('/admin', function (req, res) {
    sess = req.session;
    if (sess.email == 'nitin') {
        res.render('admin', {
            name: sess.email
        });
    }
    else {
        res.render('adminNotLoggedIn');
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/adminLogin');
        }
    });
});

app.post('/acceptName', (req, res) => {
    console.log("Accepted user: ", req.body.username);
    logger("Accepted user: " + req.body.username, 'DEBUG');
    res.redirect('/Game');
})

server.listen(port, () => {
    console.log(`Bingo app listening at http://localhost:${port}`)
    logger(`Bingo app listening at http://localhost:${port}`, 'INFO')
})