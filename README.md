# Zing Bites: Food Delivery App API  

This repository contains the backend API for a food delivery application, built using Node.js, Express.js, and MongoDB. The API enables features such as user authentication, restaurant management, geospatial queries for locating nearby restaurants, and order placement.  

---
API: https://zingbitesapi-production.up.railway.app/api/v1

## **Features**  
- **User Authentication**: Secure login/logout functionality using JWT.  
- **Role-Based Access Control**: Separate access levels for users and admins.  
- **Restaurant Management**: Admins can add, update, and delete restaurants with geolocation support.  
- **Dish Management**: Admins can manage dishes, including their details, pricing, and images.  
- **Nearby Restaurants**: Locate restaurants within a given radius using geospatial queries.  
- **Order Management**: Users can place orders, view order details, and manage their cart.  
- **Admin Panel**: Manage orders and update their statuses.  
- **Error Handling**: Robust error handling and validation throughout the application.  

---

## **Tech Stack**  
- **Node.js**: JavaScript runtime for building the backend.  
- **Express.js**: Web framework for designing RESTful APIs.  
- **MongoDB**: NoSQL database for data storage.  
- **Mongoose**: ODM library for MongoDB.  
- **JWT**: JSON Web Tokens for secure authentication.  
- **Postman**: API testing and documentation.  

---

## **Installation and Setup**  

1. Clone the repository:  
   ```bash
   git clone git@github.com:gitxAnkit/zingBitesAPI.git
   cd zingBitesAPI
2. Install dependencies:
    ```bash
    npm install
3. Set up environment variables:
Create a .env file in the root directory and add the following:
    ```bash
    PORT=5000
    NODE_ENV=development
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRE=5d
    COOKIE_EXPIRE=5
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    BACKEND_URL=
    MONGO_URI=mongo_uri
    SESSION_SECRET=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
4. Start the server:
    ```bash
    npm start
Test the API endpoints using Postman or any API client.


## Future Enhancements

    Implement payment gateway integration.
    Add user notifications for order updates.
    Improve scalability and optimize queries for larger datasets.
