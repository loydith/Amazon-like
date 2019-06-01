//require mysql and inquirer
var mysql = require('mysql');
var inquirer = require('inquirer');
//create connection to db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_DB"
})
//start
function start(){
  inquirer.prompt([{
    type: "list",
    name: "doThing",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","End Session"]
  }]).then(function(ans){
     switch(ans.doThing){
      case "View Products for Sale": viewProducts();
      break;
      case "View Low Inventory": viewLowInventory();
      break;
      case "Add to Inventory": addToInventory();
      break;
      case "Add New Product": addNewProduct();
      break;
      
    }
  });
}

//viewProducts
function viewProducts(){
  console.log("-------------------------------------------------");

  connection.query("SELECT * FROM Products", function(err, res){
  if(err) throw err;
  console.log("-------------------------------------------------");

  for(var i = 0; i<res.length;i++){
    console.log("ID: " + res[i].ItemID + " | " + 
                "Product: " + res[i].ProductName + " | " + 
                "Department: " + res[i].DepartmentName + " | " + 
                "Price: " + res[i].Price + " | " + 
                "Quantity: " + res[i].StockQuantity);
    console.log("-----------------------------------------------");
  }

  start();
  });
}

//viewLowInventory
function viewLowInventory(){
  console.log("------------------------------------------------");
  connection.query('SELECT * FROM Products', function(err, res){
  if(err) throw err;
  console.log("-------------------------------------------------");
  for(var i = 0; i<res.length;i++){
    if(res[i].StockQuantity <= 10){
    console.log("ID: " + res[i].ItemID + " | " + 
                "Product: " + res[i].ProductName + " | " + 
                "Department: " + res[i].DepartmentName + " | " + 
                "Price: " + res[i].Price + " | " + 
                "Quantity: " + res[i].StockQuantity);
    console.log("-----------------------------------------------");
    }
  }

  start();
  });
}

//addToInventory
function addToInventory(){
  console.log("------------------------------------------------");
  connection.query("SELECT * FROM Products", function(err, res){
  if(err) throw err;
  var itemArray = [];
  for(var i=0; i<res.length; i++){
    itemArray.push(res[i].ProductName);
  }

  inquirer.prompt([{
    type: "list",
    name: "product",
    choices: itemArray,
    message: "Which item would you like to add inventory?"
  }, {
    type: "input",
    name: "quantity",
    message: "How much would you like to add?",
    validate: function(value){
      if(isNaN(value) === false){return true;}
      else{return false;}
    }
    }]).then(function(ans){
      var currentQty;
      for(var i=0; i<res.length; i++){
        if(res[i].ProductName === ans.product){
          currentQty = res[i].StockQuantity;
        }
      }
      connection.query("UPDATE Products SET ? WHERE ?", [
        {StockQuantity: currentQty + parseInt(ans.qty)},
        {ProductName: ans.product}
        ], function(err, res){
          if(err) throw err;
          console.log("The quantity was updated.");
          start();
        });
      })
  });
}

//addNewProducts
function addNewProduct(){
  console.log("---------------------------------------------------");
  var deptNames = [];
  connection.query("SELECT * FROM Departments", function(err, res){
    if(err) throw err;
    for(var i = 0; i<res.length; i++){
      deptNames.push(res[i].DepartmentName);
    }
  })

  inquirer.prompt([{
    type: "input",
    name: "product",
    message: "Product: ",
    validate: function(value){
      if(value){return true;}
      else{return false;}
    }
  }, {
    type: "list",
    name: "department",
    message: "Department: ",
    choices: deptNames
  }, {
    type: "input",
    name: "price",
    message: "Price: ",
    validate: function(value){
      if(isNaN(value) === false){return true;}
      else{return false;}
    }
  }, {
    type: "input",
    name: "quantity",
    message: "Quantity: ",
    validate: function(value){
      if(isNaN(value) == false){return true;}
      else{return false;}
    }
  }]).then(function(ans){
    connection.query("INSERT INTO Products SET ?",{
      ProductName: ans.product,
      DepartmentName: ans.department,
      Price: ans.price,
      StockQuantity: ans.quantity
    }, function(err, res){
      if(err) throw err;
      console.log("Another item was added to the store.");
    })
    start();
  });
}

start();
