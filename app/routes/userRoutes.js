const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const appConfig = require('../../config/appconfig');
const userController = require('../controller/userController');
const authMiddleware = require('../middlewares/auth');
var path = require('path');

let setRouter = (app) =>{

    let baseURl = `${appConfig.apiVersion}/users`;


  app.use(`/apidoc`, express.static(path.join(__dirname, '../../apidoc')));

    app.post(`${baseURl}/signup`,userController.signup);
        /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup New user signup
     *
     * @apiParam {string} firstName first Name of the user. (body params) (required)
     * @apiParam {string} LastName last Name of the user. (body params) (required)
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {number} mobileNumber mobileNumber  of the user. (body params) (required)
     * @apiParam {Number} countryCode countryCode of the user. (body params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
  "error": false,
  "message": "User Account created successfully",
  "status": 200,
  "data": {
    "userId": "XRL3T8kBi",
    "firstName": "Raj",
    "lastName": "G",
    "email": "abc@abc.com",
    "mobileNumber": 9876543212,
    "countryCode": 91,
    "createdOn": "2020-05-07T10:36:38.000Z",
    "friendReq": [],
    "friendList": [],
    "PasswordResetToken": "",
    "PasswordResetExpiration": ""
  }
}
    */


    app.post(`${baseURl}/login`,userController.login);

        /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/login User login
     * 
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "userId": "nvQquVGDE",
    "firstName": "Demo",
    "lastName": "User",
    "email": "Demo.User@gmail.com",
    "mobileNumber": 9773676766,
    "countryCode": 91,
    "createdOn": "2020-05-06T04:25:19.000Z",
    "friendReq": [],
    "friendList": [],
    "PasswordResetToken": "NFYqYfVkk",
    "PasswordResetExpiration": "2020-05-07T05:04:33.865Z"
  }
    */



    app.post(`${baseURl}/getUser`,userController.getUserDetails);

    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/getUser Get user details using ID
     * @apiParam {string} user Id. (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "user found",
    "status": 200,
    "data": [
        {
            "userId": "3dgkejht3",
            "firstName": "Praveen",
            "lastName": "k",
            "email": "Pk@gmail.com",
            "countryCode": 91,
            "mobileNumber": 98765327655,
            "createdOn": "2020-05-01T08:01:01.000Z"
        }
    }
    */


    app.post(`${baseURl}/update`,userController.updateUser);
    
    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/update Update user details using ID
     * @apiParam {string} user Id. (body params) (required)
     * @apiParam {any} all required fields for updating. (URL params) 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "user details updated",
    "status": 200,
    "data": {
        "ok": 1,
        "n": 2
    }
}
    */




    app.post(`${baseURl}/add/frndRequest`,authMiddleware.isAuthorized,userController.addFrndReq);
    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/add/frndRequest Send Friend request using User Id
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} frmUserId userId of the receipent of the friend request (body params) (required)
     * @apiParam {string} userId userId of the sender of the friend request (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
  "error": false,
  "message": "Request sent successfully",
  "status": 200,
  "data": {
    "userId": "pfEd5RDsK",
    "firstName": "Shubham",
    "lastName": "Kalra",
    "email": "shubh@abc.com",
    "mobileNumber": 9876565656,
    "countryCode": 91,
    "createdOn": "2020-05-07T05:54:00.000Z",
    "friendReq": [
      {
        "userId": "pfEd5RDsK",
        "fromUserId": "nvQquVGDE",
        "fromName": "Praveen Kumar",
        "fromEmail": "tech2praveen@gmail.com"
      }
    ],
    "friendList": [],
    "PasswordResetToken": "",
    "PasswordResetExpiration": ""
  }
}
    */


    app.post(`${baseURl}/acceptReq`,authMiddleware.isAuthorized,userController.acceptReq);

    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/acceptReq Accept Request(move user from friend request list to friend list)
     * @apiParam {query} authToken to be provided as query parameter (required) 
     * @apiParam {string} frmUserId user Id of the user to be moved. (body params) (required)
     * @apiParam {string} userId user Id of the user accepting the friend request. (body params) (required) 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
    {
  "error": false,
  "message": "User added successfully",
  "status": 200,
  "data": {
    "userId": "nvQquVGDE",
    "firstName": "Praveen",
    "lastName": "Kumar",
    "email": "tech2praveen@gmail.com",
    "mobileNumber": 9773676766,
    "countryCode": 91,
    "createdOn": "2020-05-06T04:25:19.000Z",
    "friendReq": [],
    "friendList": [
      {
        "userId": "nvQquVGDE",
        "fromUserId": "pfEd5RDsK",
        "fromName": "Shubham Kalra",
        "fromEmail": "shubh@abc.com"
      }
    ],
    "PasswordResetToken": "NFYqYfVkk",
    "PasswordResetExpiration": "2020-05-07T05:04:33.865Z"
  }
}
     */




app.post(`${baseURl}/reject`,authMiddleware.isAuthorized,userController.deleteReq);

/**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post}/api/v1/users/reject Remove User from friend request list
     * @apiParam {query} authToken to be provided as query parameter (required) 
     * @apiParam {string} frmUserId user Id of the user to be moved. (body params) (required)
     * @apiParam {string} userId user Id of the user accepting the friend request. (body params) (required) 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
    {
  "error": false,
  "message": "Request deleted successfully",
  "status": 200,
  "data": {
    "userId": "nvQquVGDE",
    "firstName": "Praveen",
    "lastName": "Kumar",
    "email": "tech2praveen@gmail.com",
    "mobileNumber": 9773676766,
    "countryCode": 91,
    "createdOn": "2020-05-06T04:25:19.000Z",
    "friendReq": [],
    "friendList": [
      {
        "userId": "nvQquVGDE",
        "fromUserId": "pfEd5RDsK",
        "fromName": "Shubham Kalra",
        "fromEmail": "shubh@abc.com"
      }
    ],
    "PasswordResetToken": "NFYqYfVkk",
    "PasswordResetExpiration": "2020-05-07T05:04:33.865Z"
  }
}
     */





    app.post(`${baseURl}/getAll`,authMiddleware.isAuthorized,userController.getAllUsers)
        /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {get}/api/v1/users/getAll Get all Users Details with friend request Status
     * 
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
  "error": false,
  "message": "all user details found",
  "status": 200,
  "data": [
    {
      "userId": "SAow6NpJo",
      "firstName": "Praveen",
      "lastName": "k",
      "email": "abc@gmail.com",
      "status": "new"
    },
    {
      "userId": "-yEc5uBrD",
      "firstName": "Dipak",
      "lastName": "def",
      "email": "def@gmail.com",
      "status": "new"
    },
    {
      "userId": "nvQquVGDE",
      "firstName": "Praveen",
      "lastName": "Kumar",
      "email": "tech2praveen@gmail.com",
      "status": "done"
    },
    {
      "userId": "pfEd5RDsK",
      "firstName": "Shubham",
      "lastName": "Kalra",
      "email": "shubh@abc.com",
      "status": "self"
    },
    {
      "userId": "XRL3T8kBi",
      "firstName": "Mayank",
      "lastName": "G",
      "email": "abcc@abc.com",
      "status": "new"
    }
  ]
}
    */


    app.post(`${baseURl}/using/email/updateUser`,userController.updateUserusingEmail);

    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/using/email/updateUser Update user details using Email
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {any} options options to be updated. (body params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "user details updated",
    "status": 200,
    "data": {
        "ok": 1,
        "nModified": 0,
        "n": 1
    }
}
    */

    app.get(`${baseURl}/getinfo/using/token/:token`,userController.getUserInfousingResetToken);

        /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {get}/api/v1/users/getinfo/using/token/:token Get user details using password reset token
     * @apiParam {string} password reset token. (URL params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
    "error": false,
    "message": "user details found",
    "status": 200,
    "data": {
       "userId": "nvQquVGDE",
    "firstName": "Demo",
    "lastName": "User",
    "email": "Demo.User@gmail.com",
    "mobileNumber": 9773676766,
    "countryCode": 91,
    "createdOn": "2020-05-06T04:25:19.000Z",
    "friendReq": [],
    "friendList": [],
    "PasswordResetToken": "NFYqYfVkk",
    "PasswordResetExpiration": "2020-05-07T05:04:33.865Z"
    }
}    */



        app.post(`${baseURl}/password/update`,userController.updateUserPassword)
    
        /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/password/update Update user password
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "Password updated",
    "status": 200,
    "data": {
        "ok": 1,
        "nModified": 0,
        "n": 1
    }
}
    */


}


module.exports = {
    setRouter:setRouter
}
