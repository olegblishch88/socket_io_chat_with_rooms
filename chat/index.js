const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const http = require('http');

mongoose.connect('mongodb://localhost/chatxxx', { useNewUrlParser: true });
const app = express();
let server = http.createServer(app);
const Chat = require('./models/Chat');
const Message = require('./models/Message');


app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
let sessionMiddleware = session({secret: 'asdadad', resave: false, saveUninitialized: false})
app.use(sessionMiddleware);

let io = require('socket.io')(server);
io.use(function(socket, next){
    sessionMiddleware(socket.request, socket.request.res, next);
});

io.on('connect',async function(socket){
   let principal = socket.request.session.principal ? socket.request.session.principal : {name: 'Anonim'};
   let chat = socket.request.session.chat ? socket.request.session.chat : await Chat.findById('5bd727177a19e70538370a9c');
   
   socket.join(chat._id);

   socket.broadcast.to(chat._id).emit('alert',{
    author: 'Chat',
    text: principal.name + 'connected!'
   });

   io.to(socket._id).emit('alert', {
    author: 'Chat',
    text:principal.name + 'Welcome in our chat'
   });


   io.to(socket.id).emit('init', await Message.find({chat: chat._id}));


   socket.on('message', async function(msg){
       let message = await Message.create({
            text: msg.text,
            date: new Date(),
            author: principal.name,
            chat: chat
       });
       io.to(chat._id).emit('message', message);
   });
});


app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/chats', async (req, res, next) => {
    let responseObject = {};
    responseObject.principal = req.session.principal ? req.session.principal : {name: 'Anonim'}; 
    let chats = await Chat.find();
    responseObject.chats = chats ? chats : [];
    res.render('chats', responseObject);
});

app.get('/chats/:id', async (req, res, next) => {
    let chat = await Chat.findById(req.params.id);
    req.session.chat = chat;
    res.render('chat',{chat});
});

app.post('/login', (req, res, next) => {
    req.session.principal = {
        name: req.body.name
    };
    res.redirect('/chats');
});

app.post('/create-chat', async (req, res, next) => {
    let chat = await Chat.create(req.body);
    res.redirect('/chats');
});


server.listen(3000);