
/* Database Preparation */
1. Add new user account as:
    login name = teaoryUser
    password = 
    host = localhost
    schema privileges = (teaory) SELECT, INSERT, UPDATE, DELETE

----------------------------------------------------------------------------------------------------------------------------------------------------------

/* Open web service (UserService.js) */
1. npm start at 'scripts' directory
2. Available paths:
    2.1 '/typtea' (GET): to retrieve list of type of tea in order to be added as the option in search product forms (normalUserSearch.html, adminProductManagement.html)
    2.2 '/search' (POST): to search product based on given criteria (normalUserSearch.html, adminProductManagement.html)
    2.3 For product management by admin (adminProductManagement.html[callItemServiceAdmin.js]):
        a. '/teaorytype/:id' (GET): to select a specific type of tea by id (tt_id)
        b. '/teaorytypes' (GET): to select all types of tea
        c. '/teaorytype' (POST): to insert new types of tea
        d. '/teaorytype' (PUT): to update new name of each type
        e. '/teaorytype' (DELETE): to delete a specific type of tea by id (tt_id)
        f. '/teaoryitem/:id' (GET): to select a specific product(item) by id (prod_id)
        g. '/teaoryitems' (GET): to select all products(items)
        h. '/teaoryitem' (POST): to insert new product (into product and product_datails tables[teaory DB])
        i. '/teaoryitem' (PUT): to update product information (into product and product_datails tables[teaory DB])
        j. '/teaoryitem' (DELETE): to delete a specific product(item) by id (prod_id)
    2.4 For user management by admin (adminUserManagement.html[callUserServiceAdmin.js])
        a. '/searchuser' (POST): to search user information based on given criteria
        b. '/teaoryuser/:id' (GET): to select a specific user by id (user_id)
        c. '/teaoryusers/' (GET): to select all users information
        d. '/teaoryuser/' (POST): to insert a new user account (into UserInfo and LoginInfo tables[teaory DB])
        e. '/teaoryuser/' (PUT): to update a user information (into UserInfo and LoginInfo tables[teaory DB])
        f. '/teaoryuser/' (DELETE): to delete a specific user account by id (user_id)
    2.5 '/newID' (GET): to get lastest id of user (when user successfully created new account, these data will be inserted as the lastest user id) 
    2.6 '/login' (GET): to get login data of all user for username and password validation (whether username and password are correct)
    2.7 '/email' (GET): to get email of all user for email validation (when user create new account, an email must not duplicate)

----------------------------------------------------------------------------------------------------------------------------------------------------------

/* Test login page and authentication service */
1. Go to login page(log in.html) clicking on login at navigation bar
2. There are 2 options: 
    2.1 sign in with username and password if you already have an account
        test case 1 (customer account): 
		username => Igonnasleep_sle
		password => sleep1234
        test case 2 (administrator account): 
		username => kanpizza_hiw
		password => ping1234
    2.2 sign up (create a new customer account)
        test case: 
            firstname: Prawn
            lastname: Sudjai
            phone: 0995527583
            email: prawn.sud@gmail.com (email should not duplicate with existing email [e.g.Iloveshabu@gmail.com])
            //then click next button
            username: prawn_sj (username should not duplicate [e.g.Ilovesalmon_luv])
            password: pnsjsusu1999 (password should not duplicate [e.g.salmon1234])
            confirm: pnsjsusu1999 (password and confirm must match)

----------------------------------------------------------------------------------------------------------------------------------------------------------

/* Test search service */
1. Search for product by normal user(customer) on search page (normalUserSearch.html call web service through callItemService.js)
2. Search for product by admin on product management page(adminProductManagement.html call web service through callItemServiceAdmin.js)
**user can search without enter any attributes, so all items will be returned.

----------------------------------------------------------------------------------------------------------------------------------------------------------

/* Test insert, update, and delete services (only admin can access) */
1. manipulate product information(adminProductManagement.html call web service through callItemServiceAdmin.js)
2. manipulate user information(adminUserManagement.html call web service through callUserServiceAdmin.js)

----------------------------------------------------------------------------------------------------------------------------------------------------------
