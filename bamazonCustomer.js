var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

function itemSearch() {}
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
    var query = "SELECT * FROM products WHERE ?"
    connection.query(query, {
            item_id: employeeResponse.id
        }, function (err, res) {
            if (err) {
                throw err
            }
            for (var i = 0; i < res.length; i++) {
                console.log(
                    "item_id: " + res[i].item_id +
                    " || product_name: " + res[i].product_name +
                    " || price: " + res[i].price +
                    " || stock_quantity: " + res[i].stock_quantity
                )

               
                    if (res[i].stock_quantity < employeeResponse.amount) {
                        console.log("Sorry we don't have that many items in stock!")
                    } else {
                    var itemsLeft = res[i].stock_quantity - employeeResponse.amount
                    console.log(itemsLeft + " Items remaining!...\n")
                }
           

                function createTotal() {
                    var price = res[i].price * employeeResponse.amount
                    console.log("Your total is: " + price + " Dollars please!")
                }
                createTotal();
                

                function changeInventory() {
                            console.log("Changing inventory in the database!\n");
                            connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: itemsLeft
                                    },
                                    {
                                        item_id: employeeResponse.id
                                    },
                                    function (err, res) {
                                        if (err) {
                                            throw err
                                        }
                                        checkAvaliability();
                                        console.log(res.affectedRows + " Product updated in the system!\n")
                                    }
                                ]
                            )
                        }
                        changeInventory();

            }

        }
    )

function deleteInventory() {
    console.log("Deleting item from the database...\n");
    connection.query(
        "DELETE FROM products WHERE ?", 
        {
            item_id: employeeResponse.id
        },
        function (err, res) {
            if (err) {
                throw err
            }
            console.log(res.affectedRows + "Products deleted from database!\n");
        }
    )
}

function takeInventory() {
    console.log("Taking Inventory...\n");
    connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) {
                throw err
            }
            console.log(res);
            connection.end();
        }
    )
}

function deleteItems() {
    console.log("Deleting item from database...\n")
    connection.query(
        "SELECT * FROM products WHERE ?",
        {
            stock_quantity: null
        },
        function (err, res) {
            if (err) {
                throw err
            }
            deleteInventory();
            console.log("Item Deleted!")
        }
    )
}

function checkAvaliability() {
    console.log("Checking if product is avaliable...\n");
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
                console.log("Sorry, we don't have enough product for you!");
                
            }
        }
    )
}
deleteItems();
takeInventory();
});