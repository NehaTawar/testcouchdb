var express = require('express');
var routes = require('./routes');
var path = require('path');
var http = require('http');
var urlEncoded = require('url');
var bodyParser = require('body-parser');
var json = require('json');
var logger = require('logger');
var methodOverride = require('method-override');

var nano = require('nano')('http://localhost:5984/');
var db = nano.use('address');
var app = express();



app.set('port', (process.env.PORT || 3000));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

app.post('/createdb', function (req, res) {
    console.log("req",req.body);
    //console.log(nano);
    //console.log("db",db);
    nano.db.create(req.body.dbname, function (err) {
        if(err){
            res.send('error creating db');
            return;
        }
        res.send("database created successfully");
    })
});

app.post('/new_contact',function(req,res){
    console.log("req",req.body);
    db.insert({name:req.body.name,phone:req.body.phone,crazy:true},function(err,body,header){
        if(err){
            res.send('error creating contact');
            return;
        }
        res.send('created contact successfully');
    })
});

app.post('/view_contacts',function(req,res){
    console.log("req",req.body);
    var allDoc = "Following are contacts"
    db.get(req.body.phone,{rev_info:true},function(err,body){
        if(!err){
            console.log("body",body)
        }
        if(body){
            allDoc +"name : "+body.name+"<br/>"+"Phone number:"+body.phone;
        }
        else{
            allDoc="No records found";
        }
        res.send(allDoc);
    })

});

app.post('/delete_contact',function(req,res){
    console.log("req",req.body);
    db.get(req.body.phone,{revs_info:true},function(err,body){
        if(!err){
            db.destroy(req.body.phone,body._rev,function(err,body){
                if(err){
                    res.send("Error deleting doc");
                    return;
                }
                res.send("Deleted successfully");
            });
        }
    })
});


http.createServer(app).listen(app.get('port'),function(){
    console.log("Server Started and listening on",app.get('port'));
});