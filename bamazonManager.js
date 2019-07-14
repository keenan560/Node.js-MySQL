
var mysql = require('mysql');

var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1Barbuda',
    database: 'bamazon_db'
});

connection.connect();

inquirer
    .prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to do Manager?',
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ]
        }
    ]).then(answers => {
        // console.log(answers); 
        switch (answers.menuChoice) {
            case 'View Products for Sale':

                viewAll();
                break;
            case 'View Low Inventory':
                viewLow();
                break;
            case 'Add to Inventory':
                addInv();
                break;
            case 'Add New Product':
                addProd();
                break;
        }
    });

function viewAll() {
    connection.query(`SELECT * FROM products PROUCTS`, function (err, results, fields) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log(`-------Item No: ${results[i].item_id}-------\nProduct Name: ${results[i].product_name}\nDepartment: ${results[i].department_name}\nPrice: $${results[i].price.toFixed(2)}\nStock: ${results[i].stock_quantity}
        `);
        };
    })
};

function viewLow() {
    connection.query(`SELECT * FROM products WHERE stock_quantity < 5`, function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            console.log(`-------Item No: ${results[i].item_id}-------\nProduct Name: ${results[i].product_name}\nDepartment: ${results[i].department_name}\nPrice: $${results[i].price.toFixed(2)}\nStock: ${results[i].stock_quantity}
        `);
        };
    });
};

function addInv() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'itemNo',
                message: 'Please enter Item Number'

            }, {
                type: 'input',
                name: 'addAmount',
                message: 'How much inventory would you like to add?'
            }
        ]).then(answers => {
            // console.log(answers);
            var itemNo = answers.itemNo;
            var amount = answers.addAmount;
            
            connection.query(`UPDATE products SET stock_quantity =  stock_quantity + ${amount} WHERE item_id = ${itemNo}`, function (err, results) {
                if (err) throw err;
                console.log("Inventory sucessfully added!");
            });

        });

};


function addProd() {
    inquirer
    .prompt([
        {
           name: 'itemName',
           message: 'Please Enter Name of New Product' 
        }, {
            name: "department",
            message: `What is the name of the item's department?`,
        }, {
            name: 'price',
            message: `Please Enter the Item's Price`
        }, {
            name: 'stock',
            message: `Please enter the item's stock`
        }
    ]).then(answers => {
        var itemName = answers.itemName;
        var department = answers.department;
        var price = answers.price;
        var stock = answers.stock;
        // console.log(answers);

        connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('${itemName}', '${department}', ${price}, ${stock})`, function(err, results){
            if (err) throw err;
            console.log("Item sucessfully added!");
        });

    });

}