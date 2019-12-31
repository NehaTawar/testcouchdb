exports.create = function(req,res){
 nano.db.create(req.body.dbname,function(err){
     if(err){
        res.send("Error creating db");
        return;
     }
     res.send("Db created Successfully");
 })
}