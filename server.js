const mysql = require('mysql');
const express = require('express');
const http = require('http');
var multer = require('multer')
var fs = require('fs');
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');

const app = express();
var refreshTokens = {}

//app.use(require('connect').bodyParser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static('node'));
app.use('/Ressources/',express.static(__dirname + '/Ressources'));

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'briefnumérique'
});

mysqlConnection.connect((err)=>{
    if(!err)
        console.log('DB connection success.');
    else
        console.log('DB connect failed. \n ERROR :' +JSON.stringify(err,undefined,2));
});


app.listen(3000,()=>console.log('express server is running '));

app.get('/api',(req, res) => {
    res.json({
        message : 'welcom to the BriefNumerique'
    });
});

app.get('/api/bureauenquete',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT * FROM bureauenquete",(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({ "bureauenquetes": rows , "message" : "bureauenquete trouvé" },undefined,2));
                    }
                    else{
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({ "bureauenquetes": [] , "message" : "bureauenquete erreur" },undefined,2));
                    }
                });
            }
            else{
                res.sendStatus(403);
            }
        }
    });

});



app.post('/api/login',(req, res)=> {
    var sql = "select * from avocat where email = ? and password = ?"
    mysqlConnection.query(sql,[req.body.email,req.body.password],
        (err, rows, fields)=>{
            if(!err){
                if(rows.length){
                    jwt.sign({user: rows[0]}, 'secretkey', (err, token)=> {
                        refreshTokens[req.body.email] = token ;
                        res.json({
                            user: rows[0],
                            token: token
                        })
                    });
                }
                else{
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ "success": 0 , "message" : "user updated erreur" },undefined,2));
                }
            }
            else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ "success": 0 , "message" : "user updated erreur" },undefined,2));
            }
        });
});

function verifyToken(req, res, next){
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    if(typeof  bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken ;
        next();

    }
    else{
        res.sendStatus(403);
    }
}
