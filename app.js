var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) {
        throw err;
    }
});

inquirer.prompt([{
            type: "input",
            message: "What is the Store ID of the product would you like to purchase?",
            name: "id"
        },
        {
            type: "number",
            message: "How many units of the product would you like to purchase?",
            name: "amount"
        }
    ]).then(function (employeeResponse) {
            {
                function createOrder() {
                    console.log("filling order...\n");
                    connection.query(
                        "DELETE FROM products WHERE ?", {
                            item_id: employeeResponse.id
                        },
                        function (err, res) {
                            if (err) {
                                throw err;
                            }
                            console.log("\nYou bought an item with the product id of " + employeeResponse.id + " today. Thank You!");
                            console.log("\nYou bought " + employeeResponse.amount + " products today, Thank You!");
                            console.log(res.affectedRows + " products Sold!\n");
                        }
                    )
                };

                function checkAvaliability() {
                    console.log("checking if product is avaliable...\n");
                    connection.query(
                        "SELECT stock_quantity FROM products WHERE ?", {
                            item_id: employeeResponse.id,
                        },

                        function (err, res) {
                            if (err) {
                                throw err;
                            }
                            console.log(res);
                            if (res < employeeResponse.amount) {
                                console.log("Sorry, we don't have enough product for you! Check these other items in the store!")
                            } else {
                                createOrder();
                            }
                        }
                    )
                }

                function updateInventory() {
                    console.log("Checking all remaining Stocks...\n");
                    connection.query(
                        "SELECT * FROM products",
                        function (err, res) {
                            if (err) {
                                throw err;
                            }
                            console.log(res);
                        });

                }
                checkAvaliability();
                updateInventory();
            }
        });