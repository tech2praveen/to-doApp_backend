const mongoose = require('mongoose');
Schema = mongoose.Schema;

let userSchema =  new Schema({

    userId:{
        type:String,
        unique:true,
        index:true,
        default:''
    },
    firstName:{
        type:String,
        default:''
    },
    lastName:{
        type:String,
        default:''
    },
    password:{
        type:String,
        default:'password'
    },
    email:{
        type:String,
        default:'',
        unique:true
    },
    mobileNumber:{
        type:Number,
        default:0
    },
    countryCode:{
        type:Number,
        default:91
    },
    createdOn:{
        type:Date,
        default:""
    },
    friendReq:{
        type:Array,
        default:[]
    },
    friendList:{
        type:Array,
        default:[]
    },
    PasswordResetToken:{
        type:String,
        default:''
    },
    PasswordResetExpiration:{
        type:String,
        default:''
    }

});

// specify the transform schema option
if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
  delete ret.password;
}

mongoose.model('User',userSchema);