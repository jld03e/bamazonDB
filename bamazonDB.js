var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Carrots072087",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runProductGuide()
});

function runProductGuide() {
  inquirer
  .prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View Product List",
      "Buy units of product using ID information"
    ]
  })
  .then(function(answer) {
    switch(answer.action) {
      case "View Product List":
      productSearch();
      break;

      case "Buy units of product using ID information":
      buyUnits();
      break;
    }
  });
}

function productSearch () {
  // inquirer
  // .prompt({
  //   name: "id",
  //   type: "input",
  //   message: "What's the ID for the product you want to buy?"
  // })
  // .then(function(answer) 
    var query = "SELECT * FROM products";
    connection.query(query, {
    }, function(err, res) {
      for (var i=0; i<res.length; i++) {
      console.log("Item ID: " + res[i].item_id +
                  " == Product Name: " + res[i].product_name + 
                  " == Quantities Left: " + res[i].stock_quantity);
      }
      buyUnits();
    })
}


function buyUnits() {
  connection.query("SELECT * FROM products", function(err, results){
    if (err) throw err;
      var choiceArray = [];
      for (var i=0; i<results.length; i++) {
        choiceArray.push(results[i].item_id);
      }
    inquirer
    .prompt([
      {
        name: "choice",
        type: "input",
        message: "Which item would you like to purchase?"
      },
      {
        name: "units",
        type: "input",
        message: "How many units would you like to purchase?"
      }
    ])
    .then(function(answer) {
      var chosenItem;
      for (var j = 0; j < results.length; j++) {
        if (parseInt(results[j].item_id) === parseInt(answer.choice)){
        chosenItem = results[j];
        var remainder = parseInt(chosenItem.stock_quantity) - parseInt(answer.units);
      }
    }
      
      //determine if there are any quantities left:
      if (parseInt(remainder) > 0) {
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: remainder
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function(error) {
            if (error) throw err;
            console.log("We have " + remainder + " left. ENJOY YOUR PURCHASE!");
            console.log("Price of Purchase: " + parseInt(answer.units) * parseInt(chosenItem.price))
            runProductGuide();
          }
        );
      }
      else {
          console.log("Not enough units! Revise purchase!");
          runProductGuide();
      }
      //this closes the else.
    });
      });
    };

// function buyUnits() {
//   inquirer
//   .prompt([
//     {
//     name: "purchase",
//     type: "input",
//     message: "What's the ID for the product you wish to purchase?",
//     validate: function(value) {
//       if (isNaN(value) === false) {
//         return true;
//       }
//       return false;
//     }
//   }
//   ])
//   .then(function(answer) {
//     var query = "SELECT item_id FROM bamazonDB WHERE ?";
//     connection.query(query, 
//       {item_id: answer.item_id}, 
//       function(err, res) {
//       for (var j=0; j<res.length; j++) {
//         console.log(" Item ID: " + res[j].item_id +
//         " == Product Name: " + res[j].product_name + 
//         " == Quantities Left: " + res[j].stock_quantity);
//        }
//      }
//     )
//   });
// }