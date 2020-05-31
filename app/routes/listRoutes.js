const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const appConfig = require('../../config/appconfig');
const userController = require('../controller/userController');
const authMiddleware = require('../middlewares/auth');
const listController = require('../controller/listController')

let setRouter = (app) =>{

    let baseUrl = `${appConfig.apiVersion}/list`;

    app.post(`${baseUrl}/create`,authMiddleware.isAuthorized,listController.createList);

        /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/list/create Create new list
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} userId userId of the user (body params) (required)
     * @apiParam {string} List name list Name of the user. (body params) (required)
     * @apiParam {Array} cards cards in the list. (body params)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
{
  "error": false,
  "message": "new list created successfully",
  "status": 200,
  "data": {
    "listId": "E2NGkJ85T",
    "listName": "Commit to GIT",
    "userId": "nvQquVGDE",
    "cards": [],
    "cardsHistory": [
      []
    ],
    "createdOn": "2020-05-07T10:20:58Z",
    "collabrators": null,
    "status": false
  }
}  */


    app.post(`${baseUrl}/getAll`,authMiddleware.isAuthorized,listController.getAllListOfUser);

    
        /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/list/getAll Get all lists using user Id
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} userId userId of the user (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
  "error": false,
  "message": "all lists found",
  "status": 200,
  "data": [
    {
      "listId": "bOhYksQ98",
      "listName": "Commit Code to GIT",
      "userId": "nvQquVGDE",
      "cards": [],
      "cardsHistory": [
        []
      ],
      "createdOn": "2020-05-07T10:03:22Z",
      "collabrators": null,
      "status": true
    },
    {
      "listId": "LqOIFfBEG",
      "listName": "Hello",
      "userId": "nvQquVGDE",
      "cards": [],
      "cardsHistory": [
        []
      ],
      "createdOn": "2020-05-07T10:15:47Z",
      "collabrators": null,
      "status": false
    },
    {
      "listId": "E2NGkJ85T",
      "listName": "Hello",
      "userId": "nvQquVGDE",
      "cards": [],
      "cardsHistory": [
        []
      ],
      "createdOn": "2020-05-07T10:20:58Z",
      "collabrators": null,
      "status": false
    }
  ]
}
    */


    app.post(`${baseUrl}/delete`,authMiddleware.isAuthorized,listController.deleteList);

        /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/list/delete Delete a list using list Id
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} listId listId of the list (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
  "error": false,
  "message": "delete successfull",
  "status": 200,
  "data": {
    "n": 1,
    "ok": 1
  }
}
    */


    app.post(`${baseUrl}/updateList/id`,authMiddleware.isAuthorized,listController.updateListUsingListId);
           /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/list/updateList/id Update a list using list Id
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} list Complete list data (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
  "error": false,
  "message": "details updated",
  "status": 200,
  "data": {
    "n": 1,
    "nModified": 1,
    "ok": 1
  }
}
    */
    

    app.post(`${baseUrl}/allList/delete`,authMiddleware.isAuthorized,listController.deleteAllListsOfUser)
            /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/list/allList/delete Delete all the lists of a user
     * @apiParam {query} authToken to be provided as query parameter (required)
     * @apiParam {string} userId userId of th user for whome all lists must be deleted (body params) (required)
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     {
    "error": false,
    "message": "delete successfull",
    "status": 200,
    "data": {
        "ok": 1,
        "n": 1
    }
}
    */
 

}


module.exports = {
    setRouter:setRouter
}