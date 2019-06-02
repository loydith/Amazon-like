var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Estudiante2019@',
	database: 'bamazon_DB',
});
//start
function start(){
  connection.query('SELECT * FROM Products', function(err, res){
    if(err) throw err;
    console.log('----------------------------------------------------------------------------------------------------')
    for(var i = 0; i<res.length;i++){
      console.log("ID: " + res[i].item_id + " | " + 
                  "Product: " + res[i].product_name + " | " + 
                  "Department: " + res[i].department_name + " | " + 
                  "Price: " + res[i].price + " | " + 
                  "Quantity: " + res[i].stock_quantity);
      console.log('--------------------------------------------------------------------------------------------------')
    }
    inquirer.prompt([
      {
        type: "input",
        name: "id",
        message: "What is the ID of the product they would like to buy?",
        validate: function(value){
          if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
            return true;
          } else{
            return false;
          }
        }
      },
      {
        type: "input",
        name: "quantity",
        message: "How many units of the product they would like to buy?",
        validate: function(value){
          if(isNaN(value)){
            return false;
          } else{
            return true;
          }
        }
      }
      ]).then(function(ans){
        var whatToBuy = (ans.id)-1;
        var howMuchToBuy = parseInt(ans.quantity);
        var grandTotal = parseFloat(((res[whatToBuy].price)*howMuchToBuy).toFixed(2));

        if(res[whatToBuy].stock_quantity >= howMuchToBuy){
          connection.query("UPDATE products SET ? WHERE ?", [
          {stock_quantity: (res[whatToBuy].stock_quantity - howMuchToBuy)},
          {item_id: ans.id}
          ], function(err, result){
              if(err) throw err;
              console.log("Success! Your total is $" + grandTotal.toFixed(2) + ". Thanks for your purchase.");
          });  
        } else{
          console.log("Insufficient quantity!!");
        }
  
        reprompt();
      })
  })
  }
  
  //reprompt
  function reprompt(){
    inquirer.prompt([{
      type: "confirm",
      name: "reply",
      message: "Would you like to purchase another item?"
    }]).then(function(ans){
      if(ans.reply){
        start();
      } else{
        console.log("Thank you, hope to see you soon!");
      }
    });
  }
  
  start();