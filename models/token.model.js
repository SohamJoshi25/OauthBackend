const mongoose = require('mongoose');
const { Schema } = mongoose;

const providerSchema = new Schema({
    provider:{
        type: String,
        required: true,
    },
    appName:{
        type: String,
        default:"NA"
    },
    providerId:{
        type: String
    },
    displayName:{
        type:String
    },
    emails:{
        type:[String]
    },
    photos:{
        type:[String],
    },
    otherData:{
        type:String
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    expiresIn: {
        type: Number, 
        default:3600
    },
    createdAt: {
        type: Number,
        default: Date.now,
    },
    updatedAt: {
        type: Number,
        default: Date.now,
    }
}, { _id: false });

const workspaceTokenSchema = new Schema({
    workspaceId: {
        type: String,
        required: true,
        unique: true
    },
    providers: {
        type: [providerSchema]
    }
}, {
    timestamps: true  
});

const workspaceTokenModel = mongoose.model('WorkspaceToken', workspaceTokenSchema);

module.exports = workspaceTokenModel;
