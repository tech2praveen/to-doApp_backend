// including all required 
const mongoose = require('mongoose');
const shortId = require('shortid');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const inputValidator = require('../libs/paramsValidationLib');
const tokenLib = require('../libs/tokenLib');
const check = require('../libs/checkLib');
const passwordLib = require('../libs/generatePasswordLib');
const time = require('../libs/timeLib');


// including all models
const authModel = mongoose.model('Auth');
const userModel = mongoose.model('User');
const listModel = mongoose.model('List');

//Function to create new list
let createList = (req,res) =>{

    let newList = new listModel({
        listId:shortId.generate(),
        listName:req.body.listName,
        userId:req.body.userId,
        cards:req.body.cards,
        createdOn:time.now()   , 
        collabrators:req.body.collabrators,
        cardsHistory:req.body.cardsHistory
    })

    newList.save((err,result)=>{
        if(err){
            logger.error(err.message, 'list controller',10)
            let apiResponse =  response.generate(true,'error in saving',400,null);
            res.send(apiResponse)

        }else{
            logger.info('list created','list controller',5)
            let apiResponse = response.generate(false,'new list created successfully',200,result);

            delete apiResponse["_id"];
          delete apiResponse["__v"];
            res.send(apiResponse);
        }

    })

} //  end of create list



//Function to get all lists of users 
let getAllListOfUser = (req,res) =>{

    listModel.find()
    .exec((err,result)=>{
        if(err){
            logger.error(err.message, 'list controller',10)
            let apiResponse = response.generate(true,'unable to find details',400,null);
            res.send(apiResponse)
        }else{
            logger.info('list details found','list controller',5)
            logger.info(result,'list controller',5);

            let userID=req.body.userId;

            let finalResult=[];

            for(let each of result )
            {
            let userID=req.body.userId;
                if(each.userId== userID || (each.collabrators!=null && each.collabrators.includes(userID)))
                {
                    finalResult.push(each);
                }
            }
            let apiResponse = response.generate(false,'all lists found',200,finalResult);
            res.send(apiResponse)
        }
    })
    
} //  end of get all list of user


//Function to delete List
let deleteList = (req,res) =>{
    listModel.deleteOne({listId:req.body.listId})
    .exec((err,result)=>{
        if(err){
            logger.error(err.message, 'list controller',10)
            let apiResponse = response.generate(true,'unable to delete',400,null);
            res.send(apiResponse)
        }else{
            logger.info('list deleted','list controller',5)
            let apiResponse = response.generate(false,'delete successfull',200,result);
            res.send(apiResponse)
        }
    })
} // end of ddelete list

//Funtion to update list using list id
let updateListUsingListId = (req,res) =>{
    let options = req.body
    listModel.update({listId:req.body.listId},options)
    .exec((err,result)=>{
        if(err){
            logger.error(err.message, 'list controller',10)
            let apiResponse = response.generate(true,'unable to update details',400,null);
            res.send(apiResponse)
        }else{
            logger.info('list updated','list controller',5)
            let apiResponse = response.generate(false,'details updated',200,result);
            res.send(apiResponse)

        }
    })
} // end of update list using listId

//Function to update all list of user
let updateAllListsOfUser = (req,res) =>{

    let options = req.body.listModel

listModel.update({userId:req.body.userId},options , {multi:true} )

.exec((err,result)=>{
    if(err){
        logger.error(err.message, 'list controller',10)
        let apiResponse = response.generate(true,'unable to update details',400,null);
        res.send(apiResponse)
    }else{
        logger.info('list updated','list controller',5)
        let apiResponse = response.generate(false,'details updated',200,result);
        res.send(apiResponse)

    }
})

} //  end of update all lists of user


//Function to delete all list
let deleteAllListsOfUser = (req,res) =>{

    listModel.deleteMany({userId:req.body.userId})
    .exec((err,result)=>{

        if(err){
            logger.error(err.message, 'list controller',10)
            let apiResponse = response.generate(true,'unable to delete details',400,null);
        res.send(apiResponse)
        }else{
            logger.info('list deleted','user controller',5)
        let apiResponse = response.generate(false,'all lists deleted',200,result);
        res.send(apiResponse)
        }

    })

}
//end of delete all list

module.exports = {
    createList:createList,
    getAllListOfUser:getAllListOfUser,
    deleteList:deleteList,
    updateListUsingListId:updateListUsingListId,
    updateAllListsOfUser:updateAllListsOfUser,
    deleteAllListsOfUser:deleteAllListsOfUser
}