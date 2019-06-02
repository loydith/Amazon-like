
var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Estudiante2019@",
  database: "bamazon_DB"
})
//start
function start(){
  inquirer.prompt([{
    type: "list",
    name: "id",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","End Session"]
  }]).then(function(ans){
     switch(ans.id){
      case "View Products for Sale": 
      viewProducts();
      break;
      case "View Low Inventory": 
      viewLowInventory();
      break;
      case "Add to Inventory": 
      addToInventory();
      break;
      case "Add New Product": 
      addNewProduct();
      break;
      
      
      
    }
  });
}

///////////////////////////////viewProducts
function viewProducts(){
  console.log("==============View Products======================");

  connection.query("SELECT * FROM products", function(err, res){
  if(err) throw err;
  console.log("-------------------------------------------------");

  for(var i = 0; i<res.length;i++){
    console.log("ID: " + res[i].item_id + " | " + 
                "Product: " + res[i].product_name + " | $" +  
                "Price: " + res[i].price + " | " + 
                "Quantity: " + res[i].stock_quantity);
    console.log("-----------------------------------------------");
  }

  start();
  });
}

//////////////////////////////viewLowInventory
function viewLowInventory(){
  console.log("==============View Low Inventory=================");
  connection.query('SELECT * FROM products', function(err, res){
  if(err) throw err;
  console.log("-------------------------------------------------");
  for(var i = 0; i<res.length;i++){
    if(res[i].stock_quantity < 5){
    console.log("ID: " + res[i].item_id + " | " + 
                "Product: " + res[i].product_name + " | $" +  
                "Price: " + res[i].price + " | " + 
                "Quantity: " + res[i].stock_quantity);
    console.log("-----------------------------------------------");
    }
  }

  start();
  });
}

////////////////////////////addToInventory
function addToInventory(){
  console.log("=============== Add to Inventory================");
  connection.query("SELECT * FROM Products", function(err, res){
  if(err) throw err;
  var itemArray = [];
  for(var i=0; i<res.length; i++){
    itemArray.push(res[i].product_name);
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
        if(res[i].product_name === ans.product){
          currentQty = res[i].stock_quantity;
        }
      }
      connection.query("UPDATE products SET ? WHERE ?", [
        {stock_quantity: currentQty + parseInt(ans.qty)},
        {product_name: ans.product}
        ], function(err, res){
          if(err) throw err;
          console.log("The quantity was updated.");
          start();
        });
      })
  });
}

/////////////////////////////////addNewProducts
function addNewProduct(){
  console.log("=================Add New Product=================");
  var deptNames = [];
  connection.query("SELECT * FROM products", function(err, res){
    if(err) throw err;
    for(var i = 0; i<res.length; i++){
      deptNames.push(res[i].department_name);
    }
  })

  inquirer.prompt([
    {
    name: "product",
    message: "Product: ",

  }, {
    
    name: "department",
    message: "Department: ",
    
  }, {
    
    name: "price",
    message: "Price: ",
    
  }, {
    
    name: "quantity",
    message: "Quantity: ",
    validate: function(value){
      if(isNaN(value) == false){return true;}
      else{return false;}
    }
  }]).then(function(ans){
    connection.query("INSERT INTO products SET ?",{
      // item_id: ans.id,
      product_name: ans.product,
      price: ans.price,
      department_name: ans.department,
      stock_quantity: ans.quantity
    }, function(err, res){
      if(err) throw err;
      console.log("Another item was added to the store.");
    })
    start();
  });
}

start();
