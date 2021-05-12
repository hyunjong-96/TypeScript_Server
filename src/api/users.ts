import express from 'express'
import gravatar from 'gravatar'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import config from '../../config'
import {check, validationResult} from 'express-validator'

const router = express.Router();

import User from "../models/User";

/**
 * @route Post api/users
 * @desc Register User
 * @access public
 */

router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),//false거나 비어있으면 두번쨰 파라미터 반환
        check("email", "Please include a valid email").isEmail(),//이메일 형식이아니면 두번쨰 파라미터 반환
        check("password","Please enter a password with 6 or more characters").isLength({min:6})//길이가 6이하면 두번쨰 파라미터 반환
    ],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const { name, email, password } = req.body;

        try{
            //check already user
            let user = await User.findOne({email});

            if(user){
                res.status(400).json({errors:[{msg:"User already exists"}]})
            }

            //Get users gravatar
            const avatar = gravatar.url(email,{
                s:"200",
                r:"pq",
                d:"mm",
            });

            user = new User({
                name,
                email,
                avatar,
                password
            })

            //Encrpyt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);

            await user.save();

            //Return jsonwebtoken
            const payload={
                user:{
                    id:user.id
                }
            };
            jwt.sign(payload,config.jwtSecret,{expireIn:36000},(err,token)=>{
                if(err) throw err;
                res.json({token})
            })
        }catch(err){
            console.error(err.message);
            res.status(500).send("Server Error")
        }
    }
);
module.exports = router;