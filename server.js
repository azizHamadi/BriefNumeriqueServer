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

app.get('/api/Client/getAll/:id',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){

                mysqlConnection.query("SELECT * from client where id_Av = ? and etat='oui' ",[req.params.id],(err, rows, fields)=>{
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

app.post('/api/Client/UploadImage',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                var fileName = "";
                var upload = multer({dest: 'Ressources/Client/'}).single('file')
                upload(req, res, function (err) {
                    if (err) {
                        console.log("Error uploading file: " + err)
                        return
                    }
                    fs.rename('./Ressources/Client/' + req.file["filename"], './Ressources/Client/' + req.file["filename"] + '.jpg', function (err) {
                        if (err) console.log('ERROR: ' + err);
                    });
                    fileName += req.file["filename"];
                    res.json(fileName + ".jpg");
                })
            }
            else{
                res.sendStatus(403);
            }
        }
    });
});


app.post('/api/Client/AddClient',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{

            if(Object.values(refreshTokens).includes(req.token)){
                console.log(req.body.nomComplet + " " + req.body.cin_pass + " " + req.body.dateEmission + " " + req.body.tel + " " + req.body.dateNaissance + " " + req.body.lieuNaissance + " " + req.body.adresse + " " + req.body.adresse + " " + req.body.proffession + " " + req.body.mail + " " + " " + req.body.id_Av + " " + req.body.image);
                mysqlConnection.query("INSERT INTO client (nomComplet,cin_pass,dateEmission,numPasseport,periodeValPass,tel,dateNaissance,lieuNaissance,nom_Comp_pere,adresse,proffession,lieuTravail,mail,id_Av,image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.nomComplet,req.body.cin_pass,req.body.dateEmission,"21213213","132135465",req.body.tel,req.body.dateNaissance,req.body.lieuNaissance,"kjbkjbk",req.body.adresse,req.body.proffession,"azfaafefae",req.body.mail,req.body.id_Av,req.body.image],(err, rows, fields)=>{
                    if(!err){
                        console.log("d5al");
                        res.setHeader('Content-Type', 'application/json');
                        res.json("succes");
                    }
                    else{
                        console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.json("failed");
                    }
                });
            }
            else{
                res.sendStatus(403);
            }
        }
    });
});


app.post('/api/Client/DeleteClient',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{

            if(Object.values(refreshTokens).includes(req.token)){
                console.log(req.body.nomComplet + " " + req.body.cin_pass + " " + req.body.dateEmission + " " + req.body.tel + " " + req.body.dateNaissance + " " + req.body.lieuNaissance + " " + req.body.adresse + " " + req.body.adresse + " " + req.body.proffession + " " + req.body.mail + " " + " " + req.body.id_Av + " " + req.body.image);
                mysqlConnection.query("update client set etat='non' where id = ?",[req.body.id],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.json("succes");
                    }
                    else{
                        console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.json("failed");
                    }
                });
            }
            else{
                res.sendStatus(403);
            }
        }
    });
});

app.post('/api/Client/UpdateClient',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{

            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("update client set nomComplet=?, cin_pass=?, dateEmission=?, dateNaissance=?, lieuNaissance= ?, adresse=?, proffession=?, mail=?, image=? where id = ?", [req.body.nomComplet,req.body.cin_pass,req.body.dateEmission,req.body.dateNaissance,req.body.lieuNaissance,req.body.adresse,req.body.proffession,req.body.mail,req.body.image,req.body.id],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.json("succes");
                    }
                    else{
                        console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.json("failed");
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
                mysqlConnection.query("INSERT INTO session (nomSession,date,sujet,notes,Disp_prep,Cpt_Rd_Sess,id_Aff,status) VALUES (?,?,?,?,?,?,?,'oui')",[req.body.nomSession,req.body.date,req.body.sujet,req.body.notes,req.body.Disp_prep,req.body.Cpt_Rd_Sess,req.body.id_Aff],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send("succes");
                    }
                    else{
                        console.log(err)
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

app.put('/api/Session/Delete/:id',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("UPDATE session set status = 'non' WHERE id = ?",[req.params.id],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send("succes");
                    }
                    else{
                        console.log(err)
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

app.get('/api/session/getAll/:id',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT id,nomSession,s.date,s.sujet,s.notes,s.Disp_prep,s.Cpt_Rd_Sess,a.id_Av,s.id_Aff FROM session s INNER JOIN affaire a ON s.id_Aff = a.num_Aff where a.id_Av = ? and s.status = 'oui' ORDER BY s.date DESC",[req.params.id],(err, rows, fields)=>{
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

app.put('/api/Session/Update',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("UPDATE session SET nomSession = ?, date = ?, sujet = ?, notes = ?, Disp_prep = ?, Cpt_Rd_Sess = ? WHERE id = ?",
                    [req.body.nomSession, req.body.date, req.body.sujet, req.body.notes, req.body.Disp_prep, req.body.Cpt_Rd_Sess, req.body.id],(err, rows, fields)=>{
                        if(!err){
                            res.setHeader('Content-Type', 'application/json');
                            res.send("succes");
                        }
                        else{
                            console.log(err)
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


app.get('/api/session/getAllByAffaire/:idU/:idA',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT id,nomSession,s.date,s.sujet,s.notes,s.Disp_prep,s.Cpt_Rd_Sess,a.id_Av,s.id_Aff FROM session s INNER JOIN affaire a ON s.id_Aff = a.num_Aff where a.id_Av = ? AND s.id_Aff = ? AND s.status = 'oui' ORDER BY s.date DESC",[req.params.idU,req.params.idA],(err, rows, fields)=>{
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

app.get('/api/Session/getSessionById/:id',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT * FROM session WHERE id = ?",[req.params.id],(err, rows, fields)=>{
                    if(!err){

                        if(rows.length){
                            res.setHeader('Content-Type', 'application/json');
                            res.send(rows[0])
                        }
                        else{
                            res.setHeader('Content-Type', 'application/json');
                            res.send("no demande this id");
                        }
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
                mysqlConnection.query("SELECT * FROM rendezvous where id_Av = ? ORDER by date DESC",[req.params.id],(err, rows, fields)=>{
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
                mysqlConnection.query("SELECT id,nomMission,m.date ,duree,partieConcernee,adressePartieC,type,requis,notes, id_Aff FROM mission m , affaire a WHERE m.id_Aff = a.num_Aff and a.id_Av=? and m.status = 'oui' ORDER by m.date DESC",[req.params.id],(err, rows, fields)=>{
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

app.post('/api/Mission/AddMission',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("INSERT INTO mission (nomMission,date,duree,partieConcernee,adressePartieC,type,requis,notes,id_Aff,status) VALUES (?,?,?,?,?,?,?,?,?,'oui')",
                    [req.body.nomMission, req.body.date, req.body.duree, req.body.partieConcernee, req.body.adressePartieC, req.body.type, req.body.requis,req.body.notes,req.body.id_Aff],(err, rows, fields)=>{
                        if(!err){
                            res.setHeader('Content-Type', 'application/json');
                            res.send("succes");
                        }
                        else{
                            console.log(err)
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

app.put('/api/Mission/Delete/:id',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("UPDATE mission set status = 'non' WHERE id = ?",[req.params.id],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send("succes");
                    }
                    else{
                        console.log(err)
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

app.put('/api/Mission/Update',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("UPDATE mission SET nomMission = ?, date = ?, partieConcernee = ?, adressePartieC = ?, type = ?, requis = ?, notes = ? WHERE id = ?",
                    [req.body.nomMission, req.body.date, req.body.partieConcernee, req.body.adressePartieC, req.body.type, req.body.requis, req.body.notes, req.body.id],(err, rows, fields)=>{
                        if(!err){
                            res.setHeader('Content-Type', 'application/json');
                            res.send("succes");
                        }
                        else{
                            console.log(err)
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

app.get('/api/mission/getAllByAffaire/:idU/:idA',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT id,nomMission,m.date ,duree,partieConcernee,adressePartieC,type,requis,notes, id_Aff FROM mission m , affaire a WHERE m.id_Aff = a.num_Aff and a.id_Av=? and m.id_Aff = ? and m.status = 'oui' ORDER by m.date DESC",[req.params.idU,req.params.idA],(err, rows, fields)=>{
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

app.get('/api/mission/getMissionById/:id',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT * FROM mission WHERE id = ?",[req.params.id],(err, rows, fields)=>{
                    if(!err){

                        if(rows.length){
                            res.setHeader('Content-Type', 'application/json');
                            res.send(rows[0])
                        }
                        else{
                            res.setHeader('Content-Type', 'application/json');
                            res.send("no mission this id");
                        }
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


app.get('/api/demande/getAllByAffaire/:idA',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT * FROM demande WHERE id_Aff = ? and status = 'oui' ORDER by date DESC",[req.params.idA],(err, rows, fields)=>{
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

app.post('/api/Demande/AddDemande',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("INSERT INTO demande (nomDemande,partieConcernée,type,sujet,date,notes,id_Aff,status) VALUES (?,?,?,?,?,?,?,'oui')",
                    [req.body.nomDemande, req.body.partieConcernée, req.body.type, req.body.sujet, req.body.date, req.body.notes, req.body.id_Aff],(err, rows, fields)=>{
                        if(!err){
                            res.setHeader('Content-Type', 'application/json');
                            res.send("succes");
                        }
                        else{
                            console.log(err)
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


app.put('/api/Demande/Delete/:id',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("UPDATE demande set status = 'non' WHERE id = ?",[req.params.id],(err, rows, fields)=>{
                    if(!err){
                        res.setHeader('Content-Type', 'application/json');
                        res.send("succes");
                    }
                    else{
                        console.log(err)
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

app.put('/api/Demande/Update',verifyToken,(req, res)=> {
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("UPDATE demande SET nomDemande = ?, partieConcernée = ?, type = ?, sujet = ?, date = ?, notes = ? WHERE id = ?",
                    [req.body.nomDemande, req.body.partieConcernée, req.body.type, req.body.sujet, req.body.date, req.body.notes, req.body.id],(err, rows, fields)=>{
                        if(!err){
                            res.setHeader('Content-Type', 'application/json');
                            res.send("succes");
                        }
                        else{
                            console.log(err)
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


app.get('/api/Demande/getDemandeById/:id',verifyToken,(req, res)=>{
    jwt.verify(req.token, 'secretkey',(err, authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{
            if(Object.values(refreshTokens).includes(req.token)){
                mysqlConnection.query("SELECT * FROM demande WHERE id = ?",[req.params.id],(err, rows, fields)=>{
                    if(!err){

                        if(rows.length){
                            res.setHeader('Content-Type', 'application/json');
                            res.send(rows[0])
                        }
                        else{
                            res.setHeader('Content-Type', 'application/json');
                            res.send("no demande this id");
                        }
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

                mysqlConnection.query("SELECT num_Aff,t1.degre,sujet,date,etat,id_Clt,id_Crl,id_Av,num_Cas_Prec,num_Av_Cont,etat_Av_Cont,nomAff,t2.degre as cercle FROM Affaire t1 INNER JOIN cercle t2 ON t1.id_Crl = t2.id where id_Av = ?",[req.params.id],(err, rows, fields)=>{
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
