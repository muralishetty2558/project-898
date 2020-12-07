Step 1 : Use luckyshine-migration-sql.txt to import the xlsx data to mysql.
Step 2 : update config.js with the mysql connection details.
Step 3 : npm install
Step 4 : npm test 
Step 5 : npm start
Step 6 : Using postman, send get requests.

Application routes are :

 - GET /find/treasure 
    Query params: latitude, longitude, distance, prize(optional param).

 - GET /find/user/treasure
    Query params: username