import mongoose from 'mongoose'
import {IExperience} from '../interface/IExperience'
import {IEducation} from '../interface/IEducation'
import {ISocial} from '../interface/ISocial'

export interface IProfile{
    user : mongoose.Types.ObjectId;
    company : string;
    website : string;
    location : string;
    status : string;
    skill : [string];
    bio : string;
    githubusername : string;
    experience : [IExperience];
    education : [IEducation];
    social : [ISocial];
    date : Date;
}