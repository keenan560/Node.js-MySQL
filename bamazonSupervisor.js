var mysql = require('mysql');

var inquirer = require('inquirer');

var Table = require('cli-table-redemption');

const chalk = require('chalk');

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
            message: 'What would you like to do Supervisor?',
            choices: [
                'View Product Sales by Department',
                'Create New Department',
                'Exit'
            ]
        }
    ]).then(answers => {
        // console.log(answers);
        switch (answers.menuChoice) {
            case 'View Product Sales by Department':
                viewProdSales();
                break;
            case 'Create New Department':
                createDept();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    });


function viewProdSales() {
    connection.query(`
  select 
d.department_id as Dept_ID,
p.department_name as Dept_Name,
d.over_head_costs as Over_Head,
p.product_sales as Sales
from 
departments d
right join products p
on d.department_name = p.department_name

;`, function (err, results) {
            if (err) throw err;
            // console.log(results[0]);

            var table = new Table({
                head: [chalk.yellow('Department ID'), chalk.yellow('Department Name'), chalk.yellow('Over Head Costs'), chalk.yellow('Product Sales'), chalk.yellow('Total Profit')],
                colWidths: [20, 20, 20, 20, 20]
            });

            for (var i = 0; i < results.length; i++) {
                var totalProfit = results[i].Sales - results[i].Over_Head;
                table.push([`${chalk.white(results[i].Dept_ID)}`, `${results[i].Dept_Name}`, `${chalk.red(results[i].Over_Head)}`, `${results[i].Sales}`, chalk.green(totalProfit)]);
            }

        

            console.log(chalk.cyan(table.toString()));
            connection.end();
        })
};

function createDept() {
    inquirer
        .prompt(
            [
                {
                    name: 'deptName',
                    message: 'Please enter new department name'
                }, {
                    name: 'overHead',
                    message: 'Please enter over head costs for department'
                }
            ]
        ).then(answers => {
            console.log(answers);
            var deptName = answers.deptName;
            var overHead = answers.overHead;
            connection.query(`INSERT INTO departments (department_name, over_head_costs) VALUES ('${deptName}', ${overHead})`, function (err, results) {
                if (err) throw err;
                console.log(`Department added!`);
                connection.end();
            });
        });

}