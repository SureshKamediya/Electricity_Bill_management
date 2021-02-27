const express = require("express");
const bodyParser = require("body-parser");
var mysql = require("mysql");
var JSAlert = require("js-alert");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password : "Surya@18",
  database : "elecdb"
});

const app = express();
app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var customers_ = [];
var admins = [];


con.connect(function(err){
  if(err){
    console.log(err);
  };
    console.log("connected my_sql");
});

app.get("/",function(req, res){
  res.render("home");
});


app.get("/logincustomer",function(req, res){
  res.render("logincustomer");
});

app.get("/loginadmin",function(req, res){
  res.render("loginadmin");
})

app.get("/register",function(req, res){
  res.render("register");
});

app.post("/",function(req, res){
   res.send("Its nothing");
});



app.post("/register", function(req,res){
  let username = req.body.mobile;
  var sql7 = "insert into customer (cust_name, account_type, address, state, city, pincode, email_id, mobile_no, password, status) values("+"\""+req.body.name+"\", \"regular\", \""+req.body.address+"\", \""+req.body.state+"\", \""+req.body.city+"\", \""+req.body.pincode+"\", \""+req.body.email+"\", \""+req.body.mobile+"\", \""+req.body.password+"\", \"Activated\")";
  con.query(sql7,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      let str = "customer"+ username;
      res.redirect(str);
    }
  });
});

app.post("/logincustomer", function(req,res){
  let username = req.body.mobile;
  let pass = req.body.password;
  var sql11 = "select count(*) as count from customer where mobile_no = "+"\"" + username+"\"";
  con.query(sql11,function(err, result){
    if(err){
       console.log(err);
     }
     else{
       let un =result[0].count;
       if(un==0){
         res.send("Invalild Username");
       }
       else{
         var sql12 = "select count(*) as count2 from customer where password ="+"\""+pass+ "\""+ "and mobile_no="+"\""+username+"\"";
         con.query(sql12,function(err, result){
           if(err){
              console.log(err);
            }
            else{
              let pw = result[0].count2;
              if(pw==0){
                res.send("Wrong password");
               }
              else{
                let str = "customer"+username;
                res.redirect(str);
              }
            }
          });
       }
     }
   });

});

app.post("/loginadmin", function(req,res){
  let username = req.body.username;
  let pass = req.body.password;
  var sql1 = "select count(*) as count from admin where login_id = "+"\"" + username+"\"";
  con.query(sql1,function(err, resulta){
    if(err){
       console.log(err);
     }
     else{
       let un =resulta[0].count;
       if(un==0){
         res.send("Invalild Username");
       }
       else{
         var sql2 = "select count(*) as count2 from admin where password ="+"\""+pass+ "\""+ "and login_id="+"\""+username+"\"";
         con.query(sql2,function(err, result){
           if(err){
              console.log(err);
            }
            else{
              let pw = result[0].count2;
              if(pw==0){
                res.send("Wrong password");
               }
              else{
                let str = "admin"+username;
                res.redirect(str);
              }
            }
          });
       }
     }
   });
});

app.get("/:topic",function(req, res){
  const id = req.params.topic;
  if(id.includes("admin",0)){
    var ans = id.substring(5);
    var sql9 = "select * from admin where login_id="+"\""+ans+"\"";
    con.query(sql9,function(err, result){
       if(err){
         console.log(err);
       }
       var admin = result[0];
       res.render("admin");
     });
  }
  else if(id.includes("customer",0)){
    let ans = id.substring(8);
    let sql10 = "select * from customer where mobile_no="+"\""+ans+"\"";
    con.query(sql10,function(err, result){
       if(err){
         console.log(err);
       }
       var customer = result[0];
       res.render("customer",{customer:customer});
     });
  }
  else if(id.includes("cust",0)){
    var ans = id.substring(4);
    var sql13 = "select * from customer where mobile_no="+"\""+ans+"\"";
    con.query(sql13,function(err, result){
       if(err){
         console.log(err);
       }
       var customer = result[0];
       res.render("customerprofile",{customer:customer});
     });
  }
});

app.listen(3000,function(){
  console.log("Server is running on port 3000");
});
