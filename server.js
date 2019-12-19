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
                    res.send(JSON.stringify({ "user": {} , "token" : "" },undefined,2));
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

app.get('/api/session/getAll/:id',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT id,nomSession,s.date,s.sujet,s.notes,s.Disp_prep,s.Cpt_Rd_Sess,a.id_Av,s.id_Aff FROM session s INNER JOIN affaire a ON s.id_Aff = a.num_Aff where a.id_Av = ? ORDER BY s.date DESC",[req.params.id],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send(rows);
                    }
                    else{
                        res.setHeader('Content-Type', 'application/json');
                        res.send([]);
                    }
                });
            }
            else{
                res.sendStatus(403);
            }
        }
    });

});

app.get('/api/rendezvous/getAll/:id',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT * FROM rendezvous where id_Av=? order by date DESC",[req.params.id],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send(rows);
                    }
                    else{
                        res.setHeader('Content-Type', 'application/json');
                        res.send([]);
                    }
                });
            }
            else{
                res.sendStatus(403);
            }
        }
    });

});


app.get('/api/mission/getAll/:id',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT id,nomMission,m.date ,duree,partieConcernee,adressePartieC,type,requis,notes, m.id_Aff FROM mission m , affaire a WHERE m.id_Aff = a.num_Aff and a.id_Av=? ORDER by m.date DESC",[req.params.id],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send( rows );
                    }
                    else{
                        res.setHeader('Content-Type', 'application/json');
                        res.send([]);
                    }
                });
            }
            else{
                res.sendStatus(403);
            }
        }
    });

});

app.get('/api/Affaire/getAll/:id',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){

                mysqlConnection.query("SELECT num_Aff,t1.degre,sujet,date,etat,id_Clt,id_Crl,id_Av,num_Cas_Prec,num_Av_Cont,etat_Av_Cont,nomAff,t2.degre cercle FROM Affaire t1 INNER JOIN cercle t2 ON t1.id_Crl = t2.id where id_Av = ?",[req.params.id],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send( rows );
                    }
                    else{
                        res.setHeader('Content-Type', 'application/json');
                        res.send([]);
                    }
                });
            }
            else{
                res.sendStatus(403);
            }
        }
    });
});

app.get('/api/Client/getAll/:id',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){

                mysqlConnection.query("SELECT * from client where id_Av = ?",[req.params.id],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send( rows );
                    }
                    else{
                        res.setHeader('Content-Type', 'application/json');
                        res.send([]);
                    }
                });
            }
            else{
                res.sendStatus(403);
            }
        }
    });
});

app.post('/api/Session/AddSession',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("INSERT INTO session (nomSession,date,sujet,notes,Disp_prep,Cpt_Rd_Sess,id_Aff) VALUES (?,?,?,?,?,?,?)",[req.body.nomSession,req.body.date,req.body.sujet,req.body.notes,req.body.Disp_prep,req.body.Cpt_Rd_Sess,req.body.id_Aff],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send("succes");
                    }
                    else{
                        res.setHeader('Content-Type', 'application/json');
                        res.send("failed");
                    }
                });
            }
            else{
                res.sendStatus(403);
            }
        }
    });
});

