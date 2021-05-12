import express from 'express'
import config from '../config'
import request from 'request'

const router = express.Router();

/**
 * @route GET api/profile/github/:username
 * @desc Get user repos from github
 * @access public
 */

router.get("/github/:username",(req,res)=>{
    try{
        const options={
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.githubClientId}&client_secret=${config.githubSecret}`,
            method: "GET",
            headers: { "user-agent": "node.js" }
        }

        request(options,(error,response,body)=>{
            if(error) console.error(error)
            if(response.statusCode != 200){
                res.status(404).json({msg:"No github profile found"})
            }

            res.json(JSON.parse(body))
        })
    }catch(error){
        console.error(error.message)
        res.status(500).send("Server Error")
    }
})