const socketio = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');

const events = require('events');
const eventsEmitter = new events.EventEmitter();
const tokenLib = require('../libs/tokenLib');
const response = require('../libs/responseLib');
const nodeMailer = require('../libs/nodemailerLib')

let arr=[];

let setServer = (server) =>{

    let io=socketio.listen(server);
    let myIo = io.of('')

    myIo.on('connection',(socket)=>{
     
        socket.emit('send-userId','hi');

        socket.on('userId',(userId)=>{

            let abc = {
                userId:userId,
                socketId:socket.id
            }

            arr.push(abc);
             console.log(arr);
        }) //  end of socket on userId

            socket.on('newChange',(details)=>{


                if(details && details.collabrators!=null)
                {
                    
                

                console.log(details.collabrators)

                    for(let frnd of details.collabrators){

                    for(let each of arr){

                        if(frnd == each.userId && each.userId!=details.sender){
                            myIo.to(each.socketId).emit('change-made',details);
                        }
                    }
                    
                }
            }

            
            }) // end of socket new change

          

            socket.on('frndRequestSent',(id)=>{

                for(let each of arr){
                    if(each.userId == id){
                        myIo.to(each.socketId).emit('refresh',id);
                    }
                }

            }) // end of frnd request sent

            socket.on('requestAccepted',(data)=>{
                for(let each of arr){
                    if(each.userId == data.id){
                        myIo.to(each.socketId).emit('newFriend',data);
                    }
                }
            }); //  end of request accepted


            socket.on('requestRejected',(data)=>{
                for(let each of arr){
                    if(each.userId == data.id){
                        myIo.to(each.socketId).emit('RejectFriend',data);
                    }
                }
            }); 

            socket.on('mail',(data)=>{

                console.log(data);
                nodeMailer.sendMail(data);
            }) //  end of mail

            socket.on('disconnect',()=>{

                // console.log('a user is disconnected')

                for(let each of arr){

                    if(socket.id==each.socketId){

                        let index  = arr.indexOf(each);
                        // console.log(index);
                        arr.splice(index,1);
                        // console.log(arr);

                    }

                }

            })

         

    }) //  end of myio on connection

}// end of set server



module.exports = {
    setServer:setServer
}