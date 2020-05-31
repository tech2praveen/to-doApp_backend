const mongoose = require('mongoose');
const time=require('../libs/timeLib')
Schema = mongoose.Schema

let listSchema = new Schema({

    listId:{
        type:String,
        default:''
    },
    listName:{
        type:String,
        default:''
    },
    userId:{
        type:String,
        default:''
    },
    cards:{
        type:Array,
    
    },
    cardsHistory:{
        type:Object,
        default:{card:[],listStatus:[]}
    
    }
    ,
    createdOn:{
        type:String,
        default:time.now()
    },
    collabrators:{
        type:Array,
       
    },
    status:{
        type:Boolean,
        default:false
    }

});

// specify the transform schema option
if (!listSchema.options.toObject) listSchema.options.toObject = {};
listSchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
}


mongoose.model('List',listSchema);