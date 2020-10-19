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


//-----------------------------EVERYTHING ABOVE THIS LINE WORKS


//EACH FUNCTION SHOULD CONSOLE LOG SOMETHING & THEN RETURN TO START()
//HOW DO WE END CONNECT?

//starting prompt- main menu

//FOR PROMPTS WITH A CHOICE: LISTING OPTIONS FROM DB- REFERENCE BIDAUCTION() FROM GRATEBAY
//VALIDATE INPUT FOR ADD EMPLOYEE TO MAKE SURE IT IS A STRING
//THE ONLY AREAS IN THE DB THAT CAN BE NULL IS MANAGER
//if no mamanger listed, that area of the table is listed as "null"- DEFAULT NULL
//dont forget when you're writing this code that it is an array of objects so you will be referring to indexes and properies of those indexes. i.e. res[i].first_name
//SHOULD THERE BE CODE TO SET THE SALARY FOR EACH EMPLOYEE BASED ON THEIR ROLE?

//USE PACKAGE.JSON FOR THE "START PROMPT TO RUN THE FILE"


// function testingtable() {
//     connection.query("SELECT * FROM employee", function(err, res) {
//       if (err) throw err;
  
      
//       console.table(res); //works to render the result in a table

//     });
//   }

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
        "Update Employee Roles",
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
      else if(answer.mainMenu === "Exit"){
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
  connection.query("SELECT * FROM roles", function(err, res){
    if (err) throw err;
    inquirer.
      prompt([
        {
          name: "role",
          type: "rawlist",
          choices: function(){
            var roleArray = [];
            for(var i=0; i<res.length; i++){
              roleArray.push(res[i].Title);
            }
            return roleArray;
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
              RoleID: chosenRole.RoleID
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



//----------------------VIEW----------------------------------
//View All Departments
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
