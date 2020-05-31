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

//signup function 
let signUpFucntion = (req,res) =>{

    let validateUserInput = () =>{

        return new Promise((resolve,reject)=>{

            if(req.body.email){

                if(!inputValidator.Email(req.body.email)){
                    let apiResponse = response.generate(true,'Invalid Email',400,null);
                    reject(apiResponse)
                }else if (check.isEmpty(req.body.password)){

                    let apiResponse = response.generate(true,'Password missing',400,null);
                    reject(apiResponse);
                }else{
                    resolve(req);
                }

            }else{

                let apiResponse = response.generate(true,'Email missing',400,null)
                reject(apiResponse)
            }

        }) //  end of promise of validate user input

    } // end of validate user Input

    let createUser = () =>{ 

        return new Promise((resolve,reject)=>{

        userModel.findOne({email:req.body.email})
        .exec((err,result)=>{

            if(err){

                logger.error('Unable to search db error','create user',10);
                let apiResponse = response.generate(true,'search error',400,null);
                reject(apiResponse);
            }else if(check.isEmpty(result)){
                id = shortId.generate();
                let newUser = new userModel({
                    userId:id,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: passwordLib.hashpassword(req.body.password),
                    email: req.body.email,
                    mobileNumber: req.body.mobileNumber,
                    countryCode:req.body.countryCode,
                    createdOn: time.now()
                })


                newUser.save((err,newUserDetails)=>{
                    if(err){
                        logger.error('error in saving the new user', 'newuser', 10);
                        let apiResponse = response.generate(true, 'error in saving new user', 400, null);
                        reject(apiResponse);
                    }else{
                        let newUserObj = newUserDetails.toObject();
                        resolve(newUserObj);
                    } 
                })
            } else{
                
                logger.error('User already exists','create user',6);
                apiResponse = response.generate(true,'User already exists',400,null);
                reject(apiResponse)
            }

        })            

        }) //  end of promise for create user

    } // end of create user

    validateUserInput(req,res)
    .then(createUser)
    .then((resolve)=>{
        delete resolve.password
        delete resolve._V
        delete resolve._id
        let apiResponse = response.generate(false,'User Account created successfully',200,resolve);
        res.send(apiResponse)
    })
    .catch((err) => {
        res.status(err.status)
        res.send(err)
    })
    

} //  end of signup 


//login function
let loginFunction = (req,res) =>{

    let findUser = () =>{

        return new Promise((resolve,reject)=>{

            if(req.body.email){
            userModel.findOne({email:req.body.email})
            .exec((err,userDetails)=>{
                
                if (err) {
                    console.log(err)
                    logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                    /* generate the error message and the api response message here */
                    let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                    reject(apiResponse)
                    /* if Company Details is not found */
                } else if (check.isEmpty(userDetails)) {
                    /* generate the response and the console error message here */
                    logger.error('No User Found', 'userController: findUser()', 7)
                    let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                    reject(apiResponse)
                } else {
                    /* prepare the message and the api response here */
                    logger.info('User Found', userDetails, 10)
                    resolve(userDetails)
                }    
                

            })
        }else{
            let apiResponse = response.generate(true, '"Email" parameter is missing', 400, null)
                reject(apiResponse)
        }
        })

    } // end of  find user

    let validatePassword = (retrievedUserDetails) =>{
        return new Promise((resolve,reject)=>{

            passwordLib.comparePassword(req.body.password,retrievedUserDetails.password,(err,match)=>{

                if(err){
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                }else if(match){
                    let userDetails = retrievedUserDetails.toObject()
                    delete userDetails.password
                    delete userDetails._id
                    delete userDetails.__v
                    delete userDetails.createdOn
                    delete userDetails.modifiedOn
                    resolve(userDetails)
                }else{
                    
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })

        })
    } //  end of validate password
    
    let generateToken = (userDetails) =>{

        return new Promise((resolve,reject)=>{
            tokenLib.generateToken(userDetails,(err,tokenDetails)=>{

                if(err){
                    
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                }else{
                    
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    } // end of generate token
    
    
    let saveToken = (tokenDetails) =>{

        return new Promise((resolve,reject)=>{

            authModel.findOne({userId:tokenDetails.userId})
            .exec((err,retreivedTokenDetails)=>{
                if(err){
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                }else if(check.isEmpty(retreivedTokenDetails)){

                    let newAuthToken = new authModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })

                    newAuthToken.save((err,newTokenDetails)=>{
                        if(err){
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        }else{
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }else{
                   retreivedTokenDetails.authToken = tokenDetails.token
                   retreivedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                   retreivedTokenDetails.tokenGenerationTime = time.now()
                   retreivedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } 
            })

        }) //  end of promise

    } // end of save token


    findUser(req,res)
    .then(validatePassword)
    .then(generateToken)
    .then(saveToken)
    .then((resolve)=>{
        let apiResponse = response.generate(false,'Login successfull',200,resolve)
        res.status(200)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log("errorhandler");
        console.log(err);
        res.status(err.status)
        res.send(err)
    })

} // end of login function

//function to get userDetails
let getUserDetails = (req,res) =>{

    userModel.find({userId:req.body.userId})
    .select('-_id -__v,-password')
    .exec((err,result)=>{

        if(err){
            logger.error(err.message, 'getUserDetails',10)
            let apiResponse = response.generate(true,'error in searching for user',400,null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            logger.error(err.message, 'getUserDetails',10)
            let apiResponse = response.generate(true,'no such users exists',400,null);
            res.send(apiResponse)
        }else{
            logger.info('user details found','user controller',5)
            let apiResponse = response.generate(false,'user details found',200,result);
            res.send(apiResponse);
        }

    })
} //  end of get userDetails

//function to update user
let updateUser  = (req,res) =>{
    let options = req.body
    userModel.update({userId:req.body.userId},options)
    .exec((err,result)=>{
        if(err){
            logger.error(err.message, 'user controller',10)
            let apiResponse = response.generate(true,'error in searching for user',400,null);
            res.send(apiResponse)
        }else{
            logger.info('user details found','user controller',5)
            let apiResponse = response.generate(false,'user details updated',200,result);
            res.send(apiResponse);
        }
    })
} // end of update User


//function to update user details using email
let updateUserusingEmail = (req,res) =>{
    let options = req.body
    userModel.update({email:req.body.email},options)
    .exec((err,result)=>{
        if(err){
            logger.error(err.message, 'user controller',10)
            let apiResponse = response.generate(true,'error in searching for user',400,null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            logger.error(err.message, 'user controller',10)
            let apiResponse = response.generate(true,'no account found with email',400,null);
            res.send(apiResponse)
        }
        else{
            logger.info('user details found','user controller',5)
            let apiResponse = response.generate(false,'user details updated',200,result);
            res.send(apiResponse);
        }
    })
} // end of update user using email



//function to add friend request
let addFrndReq = (req,res) =>{

userModel.findOne({userId:req.body.userId})
.exec((err,result)=>{
    if(err){
        logger.error(err.message, 'user controller',10)
        let apiResponse = response.generate(true,'db error occured',400,null);
        res.send(apiResponse);
    }else if(check.isEmpty(result)){
        logger.info('user details found','user controller',5)
        let apiResponse = response.generate(true,'no such user found',400,null);
        res.send(apiResponse)
    }else{

        result.friendReq.push(req.body);

        result.save((error,results)=>{

            if(error){
                let apiResponse = response.generate(true,'unable to save',400,error);
                res.send(apiResponse)
            }else{
                let apiResponse = response.generate(false,'Request sent successfully',200,results);
                res.send(apiResponse);
            }

        })

    }
})

} // end of add frnd request

//function to acceot friend req
let acceptReq = (req,res) =>{

    userModel.findOne({userId:req.body.userId})
    .exec((err,result)=>{
        if(err){
            logger.error(err.message, 'user controller',10)
            let apiResponse = response.generate(true,'unable to search', 400, null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            logger.error(err.message, 'user controller',10)
            let apiResponse = response.generate(true,'no such user exisits',400, null);
            res.send(apiResponse)
        }else{

            for(let each of result.friendReq){
                if(each.fromUserId == req.body.fromUserId){
                    let temp = each;
                    let index = result.friendReq.indexOf(each);
                    result.friendReq.splice(index,1);
                    result.friendList.push(temp);

                    result.save((error,results)=>{

                        if(error){
                             let apiResponse = response.generate(true,'unable to save',400,null);
                             res.send(apiResponse);
                         }
                    })

                    userModel.findOne({userId:req.body.fromUserId})
                    .exec((e,r)=>{

                        if(e){
                            logger.error(e.message, 'user controller',10)
                            let apiResponse = response.generate(true,'unable to save',400,null);
                            res.send(apiResponse)
                        }else{
                            
                            let xyz = {
                                userId:req.body.fromUserId,
                                fromUserId: result.userId,
                                fromName:result.firstName+' '+result.lastName,
                                fromEmail:result.email
                            }

                            r.friendList.push(xyz);
                            r.save((er,re)=>{
                                if(er){
                                    logger.error(er.message, 'user controller',10)
                                    let apiResponse = response.generate(true,'unable to save',400,null);
                                    res.send(apiResponse)
                                }else{
                                    logger.info('user details found','user controller',5)
                                    let apiResponse = response.generate(false,'User added successfully',200,re)
                                    res.send(apiResponse);
                                }
                            })
                        }

                    })

                }
            }

        }
    })
    
}
//end of acceptReq


//function to delete request
let deleteReq = (req,res) =>{

    userModel.findOne({userId:req.body.userId})
    .exec((err,result)=>{
        if(err){
            logger.error(err.message, 'user controller',10)
            let apiResponse = response.generate(true,'unable to search', 400, null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            logger.error(err.message, 'user controller',10)
            let apiResponse = response.generate(true,'no such user exisits',400, null);
            res.send(apiResponse)
        }else{

            for(let each of result.friendReq){
                if(each.fromUserId == req.body.fromUserId){
                    let temp = each;
                    let index = result.friendReq.indexOf(each);
                    result.friendReq.splice(index,1);
                    result.save((error,results)=>{

                        if(error){
                            let apiResponse = response.generate(true,'unable to save',400,null);
                            res.send(apiResponse)
                        }else{
                            let apiResponse = response.generate(false,'Request deleted successfully',200,results)
                            res.send(apiResponse);
                        }
                    });

                }
            }

        }
    })
    
}
//end of delete function


//funtion to get all users 
let getAllUsers  = (req,res) =>{

userModel.find()
.select('email')
.select('-_id')
.select('firstName')
.select('lastName')
.select('userId')
.select('friendReq')
.select('friendList')
.lean()
.exec((err,result)=>{
    if(err){
        logger.error(err.message, 'user controller',10)
        let apiResponse = response.generate(true,'error occured while searching',400,null);
        res.send(apiResponse)
    }else if(check.isEmpty(result)){
        logger.error(err.message, 'user controller',10)
        let apiResponse = response.generate(true,'empty result returned',400,null);
        res.send(apiResponse)
    }else{
        logger.info('user details found','user controller',5);

        let userId=req.body.userId;

        for(let each of result)
        {
            
            if(each.friendList.map(function(e) { return e.fromUserId; }).indexOf(userId)!=-1)
            {
                each.status='done';
                
            }
            else if(each.friendReq.map(function(e) { return e.fromUserId; }).indexOf(userId)!=-1)
            {
                each.status='sent';
               
                
            }
            else if(userId==each.userId)
            {
                each.status='self';
            }
            else
            {
                each.status='new';
            }     

        }

        for(let each of result)
        {
            delete each.friendList;
            delete each.friendReq;
        }


            let apiResponse = response.generate(false,'all user details found',200,result)
            res.send(apiResponse)
       

      
    }
})

} //  end of get all users

//function to get user info using user tokens
let getUserInfousingResetToken = (req,res) =>{
    userModel.findOne({PasswordResetToken:req.params.token})
    .select('-_id -__v -password')
    .exec((err,result)=>{
        if(err){
            logger.error(err.message, 'user controller',10)
            let apiResponse = response.generate(true,'error occured while searching',400,null);
            res.send(apiResponse)
        }else if(check.isEmpty(result)){
            logger.error(err.message, 'user controller',10)
            let apiResponse = response.generate(true,'empty result returned',400,null);
            res.send(apiResponse)
        }else{
            logger.info('user details found','user controller',5)
            let apiResponse = response.generate(false,' user details found',200,result)
            res.send(apiResponse)
        }
    })
    
} // end of get user info using reset token

//function to update user password
let updateUserPassword = (req,res) =>{
    userModel.update({email:req.body.email},{password:passwordLib.hashpassword(req.body.password)})
    .exec((err,result)=>{
        if(err){
            logger.error(err.message, 'user controller',10)
            let apiResponse = response.generate(true,'error occured while searching',400,null);
            res.send(apiResponse)
        }else{
            logger.info('user details found','user controller',5)
            let apiResponse = response.generate(false,'Password Updated',200,result)
            res.send(apiResponse)
        }
    })
} // end of update password

module.exports = {
    signup:signUpFucntion,
    login:loginFunction,
    getUserDetails:getUserDetails,
    updateUser:updateUser,
    addFrndReq:addFrndReq,
    acceptReq:acceptReq,
    deleteReq:deleteReq,
    getAllUsers:getAllUsers,
    updateUserusingEmail:updateUserusingEmail,
    updateUserPassword:updateUserPassword,
    getUserInfousingResetToken:getUserInfousingResetToken

}
