# Flavorsome Food Schools Summer Camp

Welcome to the Flavorsome Food Schools Summer Camp project! This project is built with Node.js and Express.js for the backend and for Database used MongoDB

## Prerequisites

Before running the project, make sure you have the following installed on your machine:

-   Node.js (v12 or higher)
-   MongoDB

# Flavorsome Food Schools Summer Camp Backend

This is the backend server for the Flavorsome Food Schools Summer Camp project. It provides the necessary APIs and functionalities to manage users, classes, payments, and more.

## Technologies Used

-   Node.js
-   Express.js
-   MongoDB
-   JSON Web Token (JWT)
-   Stripe API

## Prerequisites

Before running the server, make sure you have the following installed:

-   Node.js
-   MongoDB

## Getting Started

-   Set up environment variables:

-   Create a `.env` file in the project root directory.
-   Add the following environment variables to the file:

    ```
    PORT=<port_number>
    DB_USERNAME=<mongodb_username>
    DB_PASSWORD=<mongodb_password>
    JWT_SECRET_KEY=<jwt_secret_key>
    PAYMENT_KEY=<stripe_payment_key>
    ```

-   Start the server:

-The server will be running on `http://localhost:<port_number>`.

## Available Routes

-   `/`: Default route that returns a welcome message.
-   `/health`: Health route to check the server status.
-   `/jwt`: POST route to generate a JSON Web Token for user authentication.
-   `/users`: GET and POST routes to manage users.
-   `/users-admin`: GET route to get all users (admin access only).
-   `/users/student/:email`: GET route to check if a user has a student role.
-   `/users/admin/:email`: GET route to check if a user has an admin role.
-   `/users/instructor/:email`: GET route to check if a user has an instructor role.
-   `/classes/:email`: GET route to get classes by instructor email.
-   `/classes`: GET route to get all approved classes.
-   `/all-classes-admin`: GET route to get all classes (admin access only).
-   `/classes/:id`: PATCH route to update class status and feedback (admin access only).
-   `/classes-instructor/:id`: PATCH route to update class details (instructor access only).
-   `/classes`: POST route to create a new class (instructor access only).
-   `/selected-classes`: POST route to select classes (student access only).
-   `/selected-classes/:studentEmail`: GET route to get selected classes by student email.
-   `/selected-classes/:id`: DELETE route to remove a selected class (student access only).
-   `/payments`: POST route to create a new payment (verifyJWT or USER access only).
-   `/payments`: GET route to get a new payments (verifyJWT or USER access only).

Please refer to the source code for detailed information about the request payloads and responses for each route.

## Database

The server connects to a MongoDB database using the provided credentials in the `.env` file. The collections used are:

-   `Payments`: Collection for payment information.
-   `Users`: Collection for user information.
-   `Classes`: Collection for class information.
-   `SelectedClasses`: Collection for selected classes by students.
-   `EnrolledClasses`: Collection for enrolled classes by students.

## Authentication and Authorization

JSON Web Tokens (JWT) are used for user authentication and authorization. The server verifies the JWT sent in the request headers to authenticate the user and determine their role for authorization purposes.

-   `verifyJWT`: Middleware function to verify the JWT in the request headers.
-   `verifyAdmin`: Middleware function to verify if the user has an admin role.
-   `verifyStudent`: Middleware function to verify if the user has a student role.
-   `verifyInstructor`: Middleware function to verify if the user has an instructor role.

## Payment Integration

The server integrates with the Stripe API for payment processing. The `stripe_payment_key` specified in the `.env` file is used to authenticate requests to the Stripe API.

## Error Handling

The server handles errors by sending appropriate error responses with corresponding status codes and error messages. Error handling middleware is used to centralize error handling and provide consistent responses.

## Conclusion

The Flavorsome Food Schools Summer Camp backend server provides a robust API for managing users, classes, and payments. It leverages Node.js, Express.js, MongoDB, JWT, and the Stripe API to deliver the required functionalities.

For more detailed information about the code and routes, please refer to the source code files.

## Live Server Site Link

You can visit the Live Server Site at [http://localhost:8080/]

## Author

My name is Ujjal Kumar Roy and I recently graduated with a degree in Computer Science and Engineering. I am passionate about web development and love to build things that people can use. In my free time, I enjoy playing cricket and listening to music.

-   Facebook: [Ujjal Kumar Roy](https://www.facebook.com/ujjal.roy.7862/)
-   LinkedIn: [Ujjal Kumar Roy](https://www.linkedin.com/in/ujjal-kumar-roy/)

If you have any feedback or suggestions for this project, feel free to contact me at ujjalroy7862@gmail.com
