let today = new Date().toISOString().slice(0, 10);
let time  = new Date().toTimeString().slice(0,8);
let str = today+ " "+time;
console.log(str);



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
