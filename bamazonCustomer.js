var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	//username
	user: 'root',
	//password
	password: '',
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
        var grandTotal = parseFloat(((res[whatToBuy].Price)*howMuchToBuy).toFixed(2));

        if(res[whatToBuy].StockQuantity >= howMuchToBuy){
          connection.query("UPDATE Products SET ? WHERE ?", [
          {StockQuantity: (res[whatToBuy].StockQuantity - howMuchToBuy)},
          {ItemID: ans.id}
          ], function(err, result){
              if(err) throw err;
              console.log("Success! Your total is $" + grandTotal.toFixed(2) + ". Your item(s) will be shipped to you in 3-5 business days.");
          });
  
          connection.query("SELECT * FROM Departments", function(err, deptRes){
            if(err) throw err;
            var index;
            for(var i = 0; i < deptRes.length; i++){
              if(deptRes[i].DepartmentName === res[whatToBuy].DepartmentName){
                index = i;
              }
            }
            connection.query("UPDATE Departments SET ? WHERE ?", [
            {TotalSales: deptRes[index].TotalSales + grandTotal},
            {DepartmentName: res[whatToBuy].DepartmentName}
            ], function(err, deptRes){
                if(err) throw err;
                console.log("Updated Departments Sales.");
            });
          });
  
        } else{
          console.log("Sorry, we don't have enough in stock!");
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