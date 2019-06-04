
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
function startMenu(){
  inquirer.prompt([{
    type: "list",
    name: "id",
    message: "Select one option:",
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
      
      default:
        console.log("Menu")
      
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

  startMenu();
  });
}

//////////////////////////////viewLowInventory
function viewLowInventory(){
  console.log("==============View Low Inventory=================");
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5;";
    connection.query(query, function (err, res) {

        if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " | " + 
                            res[i].product_name + " | Inventory: " + 
                            res[i].stock_quantity);
                console.log("--------------------------------------------");
            }
        } else {
            console.log("No items are low on inventory.");
        }

        startMenu();
    });
}

////////////////////////////addToInventory
function addToInventory(){
  console.log("=============== Add to Inventory================");
  connection.query("SELECT * FROM products", function(err, res){
  if(err) throw err;
  var itemArray = [];
  for(var i=0; i<res.length; i++){
    itemArray.push(res[i].product_name);
  }
  inquirer.prompt([
    {
    type: "list",
    name: "product",
    choices: itemArray,
    message: "Select the item that would you like to add:"
  }, 
    {
    name: "newProduct",
    message: "How many would you like to add?",
    validate: function(value){
      if(Number(value) === NaN){
        return "Enter a number:";
      }
    
      else{
        return true;
      }
    
    }
    }]).then(function(res){
      var query = "UPDATE products SET stock_quantity = " + res.newProduct +  " WHERE product_name = '" + res.product + "'";
            connection.query(query, function (err) {
                if (err) throw err;
                console.log("Succesfull updated.");

                startMenu();
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
    name: "name",
    message: "Type the product name: ",

  }, {
    
    name: "department",
    message: "what department belong the product? ",
    
  }, {
    
    name: "price",
    message: "How much is the price? ",
    
  }, {
    
    name: "quantity",
    message: "How many would you like to add?",
    validate: function(value){
      if(isNaN(value) == false){
        return true;
      }
      else{
        return false;
      }
    }
  }]).then(function(ans){
    connection.query("INSERT INTO products SET ?",{
      // item_id: ans.id,
      product_name: ans.name,
      price: ans.price,
      department_name: ans.department,
      stock_quantity: ans.quantity
    }, function(err, res){
      if(err) throw err;
      console.log("Another item was added to the store.");
    })
    startMenu();
  });
}

startMenu();
