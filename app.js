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

var customers = [];
var admins = [];
var bills = [];


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
      var customer_id = 0;
      var sql23 ="select * from customer where mobile_no = \""+username+"\"";
      con.query(sql23,function(err,result3){
        if(err){
          console.log(err);
        }
        else{
          customer_id= result3[0].cust_id;
          var sql20 = "insert into bill (cust_id, unit_used, current_bill, bill_due, total_bill) values("+customer_id+", 0, 0, 0, 0)";
          con.query(sql20, function(err,result2){
            if(err){
              console.log(err);
            }
          });
          let str = "customer"+ username;
          res.redirect(str);
        }
      });
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

app.post("/feedback",function(req,res){
  let username = req.body.mobile;
  let today = new Date().toISOString().slice(0, 10);
  var sql14 = "insert into feedback (cust_id,feedback,feedback_date) values("+req.body.cust_id+", \""+req.body.feedback+"\", \""+today+"\")";
  con.query(sql14,function(err,result){
     if(err){
       console.log(err);
     }
     else{
       let str = "customer"+ username;
       res.redirect(str);
     }
   });

});


app.post("/resetpass",function(req,res){
  let username = req.body.mobile;
  let password = req.body.newpass;
  let confirm_password = req.body.confirmpass;
  if(password == confirm_password){
    var sql15 = "update customer set password = \""+password+"\" where mobile_no = \""+username+"\"";
    con.query(sql15,function(err,result){
       if(err){
         console.log(err);
       }
       else{
         let str = "customer"+ username;
         res.redirect(str);
       }
     });
   }
   else{
     res.send("Confirm password doesn't matches with password");
   }
});

app.post("/admcustchange",function(req,res){
  let cust_id = req.body.cust_id;
  let unit_used = req.body.unit_used;
  let current_bill = req.body.current_bill;
  let bill_due = req.body.bill_due;
  let total_bill= req.body.total_bill;
  var sql22 = "update bill set unit_used = "+unit_used+", current_bill = "+current_bill+", bill_due = "+bill_due+", total_bill = "+total_bill+" where bill.cust_id = "+cust_id;
  con.query(sql22,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      let str ="change"+req.body.mobile;
      res.redirect(str);
    }
  });
});

var sql16 = "select * from customer";
con.query(sql16,function(err,result){
  if(err){
    console.log(err);
  }
  else{
  customers = result;
  }
});

var sql19 = "select * from admin";
con.query(sql19,function(err,result){
  if(err){
    console.log(err);
  }
  else{
  admins = result;
  }
});

var sql21 = "select * from bill";
con.query(sql21,function(err,result){
  if(err){
    console.log(err);
  }
  else{
  bills = result;
  }
});


app.get("/:topic",function(req, res){
  const id = req.params.topic;
  if(id.includes("admin",0)){
    var ans = id.substring(5);
    var sql16 = "select * from customer";
    con.query(sql16,function(err,result){
      if(err){
        console.log(err);
      }
      else{
      customers = result;
      }
    });
    var sql9 = "select * from admin where login_id="+"\""+ans+"\"";
    con.query(sql9,function(err, result){
       if(err){
         console.log(err);
       }
       var admin = result[0];
       res.render("admin",{admin: admin,customers: customers});
     });
  }
  else if(id.includes("customer",0)){
    let ans = id.substring(8);
    var sql23 = "select * from bill";
    con.query(sql23,function(err,result){
      if(err){
        console.log(err);
      }
      else{
      bills = result;
      }
    });
    let sql10 = "select * from customer where mobile_no="+"\""+ans+"\"";
    con.query(sql10,function(err, result){
       if(err){
         console.log(err);
       }
       else{
         var customer = result[0];
         res.render("customer",{customer:customer,bills:bills});
       }
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
  else if(id.includes("feed",0)){
    var ans = id.substring(4);
    var sql13 = "select * from customer where mobile_no="+"\""+ans+"\"";
    con.query(sql13,function(err, result){
       if(err){
         console.log(err);
       }
       var customer = result[0];
       res.render("feedback",{customer:customer});
     });
  }
  else if(id.includes("reset",0)){
    var ans = id.substring(5);
    var sql13 = "select * from customer where mobile_no="+"\""+ans+"\"";
    con.query(sql13,function(err, result){
       if(err){
         console.log(err);
       }
       var customer = result[0];
       res.render("resetpass",{customer:customer});
     });
  }
  else if(id.includes("adm",0)){
    var ans = id.substring(3);
    var sql17 = "select * from admin where login_id="+"\""+ans+"\"";
    con.query(sql17,function(err, result){
       if(err){
         console.log(err);
       }
       var admin = result[0];
       res.render("adminprofile",{admin:admin});
     });
  }
  else if(id.includes("change",0)){
    var ans = id.substring(6);
    var sql16 = "select * from customer";
    con.query(sql16,function(err,result){
      if(err){
        console.log(err);
      }
      else{
      customers = result;
      }
    });

    var sql19 = "select * from admin";
    con.query(sql19,function(err,result){
      if(err){
        console.log(err);
      }
      else{
      admins = result;
      }
    });
    var sql22 = "select * from bill";
    con.query(sql22,function(err,result){
      if(err){
        console.log(err);
      }
      else{
        bills = result;
        res.render("admcustchange",{customers:customers,admins:admins, ans:ans,bills:bills});
      }
    });
  }
  else if(id.includes("all",0)){
    var ans = id.substring(3);
    var sql19 = "select * from admin";
    con.query(sql19,function(err,result){
      if(err){
        console.log(err);
      }
      else{
      admins = result;
      }
    });
    var sql19 = "select * from feedback";
    con.query(sql19,function(err, result){
       if(err){
         console.log(err);
       }
       var feedbacks = result;
       res.render("allfeed",{feedbacks:feedbacks, admins:admins, ans:ans});
     });
  }
  else if(id.includes("lastpayment",0)){
    var ans =id.substring(11);
    var sql25 = "select * from customer where mobile_no="+"\""+ans+"\"";
    con.query(sql25,function(err,result){
      if(err){
        console.log(err);
      }
      else{
        var customer = result[0];
        var cust_id = result[0].cust_id;
        var sql26 = "update bill set unit_used = "+0+", current_bill = "+0+", bill_due = "+0+", total_bill = "+0+" where bill.cust_id = "+cust_id;
        con.query(sql26,function(err,result){
          if(err){
            console.log(err);
          }
          else{
            var sql27 = "select * from bill";
            con.query(sql27,function(err,result){
              if(err){
                console.log(err);
              }
              else{
                bills = result;
                res.render("customer",{customer:customer,bills:bills});
              }
            });
          }
        });
      }
    });
  }
});

app.listen(3000,function(){
  console.log("Server is running on port 3000");
});
