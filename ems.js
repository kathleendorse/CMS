var mysql = require("mysql");
 var inquirer = require("inquirer");
 const cTable = require('console.table');


 var connection = mysql.createConnection({
   host: "localhost",
   port: 3306,
   user: "root",
   password: "KaDo1104!",
   database: "ems_DB"
 });

 connection.connect(function(err) {
   if (err) throw err;  
   console.log("you are connected!")
   start();
 });


//--------------------------------------------------------

//Main Menu
const start=()=>{
  inquirer
    .prompt({
      name: "mainMenu",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add Departments",
        "Add Roles",
        "Add Employees",
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Employee Role",
        "Exit"
      ]
    }).then(function (answer){
      if(answer.mainMenu === "Add Departments"){
        addDepartment();
      }
      else if(answer.mainMenu === "Add Employees"){
        addEmployee();
      }
      else if(answer.mainMenu === "Add Roles"){
        addRole();
      }
      else if(answer.mainMenu === "View Departments"){
        viewDepartments();
      }
      else if(answer.mainMenu === "View Roles"){
        viewRoles();
      }
      else if(answer.mainMenu === "View Employees"){
        viewEmployees();
      }
      else if(answer.mainMenu === "Update Employee Role"){
        updateEmployeeRole();
      }

      else{
        connection.end();
      }
    })
}


//---------------------ADD-----------------------------------
function addDepartment(){
  inquirer.
    prompt({
      name: "departmentName",
      type: "input",
      message: "What is the Department's name?"
    }).then(answer=>{
      console.log(answer);
      connection.query(
        "INSERT INTO departments SET ?",
        {DepartmentName: answer.departmentName},
        function(err){
          if(err) throw err;
          console.log("Department was successfully Added");
          start();
        }
      );
    });
}

function addRole(){
  connection.query("SELECT * FROM departments", function(err, res){
    if (err) throw err;
    inquirer.
      prompt([
        {
          name: "department",
          type: "rawlist",
          choices: function(){
            var choiceArray= [];
            for (var i=0; i<res.length; i++){
              choiceArray.push(res[i].DepartmentName);
            }
            return choiceArray;
            },
            message: "What Department Does The Role Belong to?"
        },
        {
          name: "title",
          type: "input",
          message: "What Is The Title Of The Role?"
        },
        {
          name: "salary",
          type: "input",
          message: "What Is The Salary Of The Role?"
        }
      ]).then(function(answer){
        var chosenDepartment;
        for (var i=0; i< res.length; i++){
          if (res[i].DepartmentName === answer.department){
            chosenDepartment = res[i];
          }
        }
        if(chosenDepartment && answer.title && answer.salary){
          connection.query(
            "INSERT INTO roles SET ?",
            {
              Title: answer.title,
              Salary: answer.salary,
              DepartmentID:  chosenDepartment.DepartmentID,
            },
            function(err){
              if (err) throw err;
              console.log("Role was successfully added");
              start();
            }
          );
        }
      });
  });
}

function addEmployee(){
  var query = "SELECT roles.RoleID, roles.Title, ";
  query += "employees.EmployeeID, employees.FirstName, employees.LastName ";
  query += "FROM roles ";
  query += "LEFT JOIN employees ON roles.RoleID = employees.RoleID";

  connection.query(query, function(err, res){
    if (err) throw err;
    inquirer.
      prompt([
        {
          name: "role",
          type: "rawlist",
          choices: function(){
            const uniqueRoles = [...new Set(res.map(({Title})=> Title))];
            return uniqueRoles;
          },
          message: "What Is The Employee's Role?"
        },
        {
          name: "firstName",
          type: "input",
          message: "What's the employee's first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What's the employee's last name?",
        },
        {
          name: "manager",
          type: "rawlist",
          choices: function(){
            var managerArray = res.map(({EmployeeID, FirstName, LastName})=>({name: `${FirstName} ${LastName}`, value: EmployeeID}));
            managerArray.push({name: "None", value:null});
            return managerArray;
          },
          message: "Who Is The Employee's Manager?"
        }
      ]).then(function(answer){
        var chosenRole;
        for (var i=0; i<res.length; i++){
          if(res[i].Title === answer.role){
            chosenRole = res[i];
          }
        }
        if(chosenRole && answer.firstName && answer.lastName){
          connection.query(
            "INSERT INTO employees SET ?",
            {
              FirstName: answer.firstName,
              LastName: answer.lastName,
              RoleID: chosenRole.RoleID,
              ManagerID: answer.manager
            },
            function(err){
              if (err) throw err;
              console.log("Employee Successfully Added");
              start();
            }
          );
        }
    });
  });
}

//----------------------UPDATE----------------------------------
function updateEmployeeRole(){
  var query = "SELECT roles.RoleID, roles.Title, ";
  query += "employees.EmployeeID, employees.FirstName, employees.LastName ";
  query += "FROM roles ";
  query += "LEFT JOIN employees ON roles.RoleID = employees.RoleID";


  connection.query(query, function(err, res){
    if (err) throw err;
    inquirer
      .prompt([
        {
          name : "employeeID",
          type: "rawlist",
          choices:  function(){
            var employeeArray = res.map(({EmployeeID, FirstName, LastName})=>({name: `${FirstName} ${LastName}`, value: EmployeeID}));
            return employeeArray;
            },
          message: "Which Employee's Role Do You Want To Update?"
        },
        {
          name: "newRole",
          type: "rawlist",
          choices: function(){
            var roleArray = res.map(({RoleID, Title})=>({name: `${Title}`, value: RoleID}));
            const roleOptions = [...new Set(roleArray)];
            return roleOptions;
          },
          message: "What Is The Employee's New Role?"
        }
      ]).then(
        function(answer){
          console.log(answer); 
          connection.query("UPDATE employees SET ? WHERE ?",
          [
            {
              RoleID: answer.newRole
            },
            {
              EmployeeID: answer.employeeID
            }
          ],
          function(err){
            if (err) throw err;
            console.log("Employee Role Successfully Updated");
            start();
          }
          );
        }
      );
  });
}



//----------------------VIEW----------------------------------
function viewDepartments(){
  connection.query("SELECT * FROM departments", function(err, res){
    if (err) throw err;
    console.table(res);
    start();
  })
}

function viewRoles(){
  connection.query("SELECT * FROM roles", function (err, res){
    if (err) throw err;
    console.table(res);
    start();
  })
}

function viewEmployees(){
  connection.query("SELECT * FROM employees", function(err, res){
    if (err) throw err;
    console.table(res);
    start();
  })
}




  
//--------------------------------------------------------
// function start(){
//     inquirer
//         .prompt({
//             name: "mainMenu",
//             type: "rawlist",
//             message: "What would you like to do?",
//             choices:[
//                 "View All Employees",
//                 "View All Employees By Department",
//                 "View All Employees By Manager",
//                 "Add Employee",
//                 "Remove Employee",
//                 "Update Employee Role",
//                 "Update Employee Manager",

//                 "Add Employee"  //** */
//                 "Add Department",
//                 "Add Role",
//                 "View Department",
//                 "View Roles"
//                 "Exit",
//             ]
//         })
//          .then(function(answer){
//              console.log(answer);
// //             //conditional logic for running other functions
// //             //USE A SWITCH CASE STATEMENT FOR THIS.
// //             if(answer.mainMenu === "Add Employee"){
// //                 viewAll();
// //             }
// //             // else if(){}
// //             // else if(){}
// //             // else if(){}
// //             // else if(){}
// //             // else if(){}
// //             // else if(){}
// //             else{
// //                 connection.end();
// //             }
//      });
//  }





























// // function viewAll(){
// // //     View all employees
// // // (table) id first_name last_name department salary manager

// // }

// // function viewAllManager(){}

// // function viewAllDept(){}

// function addEmployee(){
//     inquirer
//         .prompt(
//             {
//             name: "firstName",
//             type: "input",
//             message: "What's the employee's first name?"
//             },
//             {
//             name: "lastName",
//             type: "input",
//             message: "What's the employee's last name?"  
//             },
//             {
//             name: "role",
//             type: "rawlist",
//             message: "What's the employee's role?",
//             choices:[
//                 "Sales Lead",
//                 "Salesperson",
//                 "Lead Engineer",
//                 "Software Engineer","Accountant",
//                 "Legal Team Lead",
//                 "Lawyer"
//             ]
//             },
//             {
//             name: "manager",
//             type: "rawlist",
//             message: "Who is the employee's manager?",
//             choices:[
//                 //  (list including NONE as an option)
//             ]   
//             } 
//         )
//         .then(function(answer){
// //             connection.query(
// //                 "INSERT INTO auctions SET ?",
// //                 {
// //                   item_name: answer.item,
// //                   category: answer.category,
// //                   starting_bid: answer.startingBid || 0,
// //                   highest_bid: answer.startingBid || 0
// //                 },
// //                 function(err) {
// //                   if (err) throw err;
// //                   console.log("Added (first name last name to the database)");
// //                   // re-prompt the user for if they want to bid or post
// //                   start();
// //                 }
// //               );
// //             //......
// //             // console.log - 
//          });   
// }

// function removeEmployee(){
// //     Which employee do you want to remove?
// // (list of employee names)
// // Console.log - Removed employee from the database

// }

// function updateRole(){}

// function updateManager(){
// //     Which employee's manager do you want to update? (list)
// //LIST OPTIONS INCLUDES NONE
// // Which employee do you want to set as the manager for the selected employee?
// // console.log- Updated employee's manager

// }