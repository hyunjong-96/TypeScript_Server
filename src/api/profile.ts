import express from 'express'
import config from '../config'
import request from 'request'
import Profile from '../models/Profile'

const router = express.Router();

/**
 *  @route GET api/profile/github/:username
 *  @desc Get user repos from github
 *  @access Public
 */
 router.get("/github/:username", (req, res) => {
    try {
      const options = {
        uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.githubClientId}&client_secret=${config.githubSecret}`,
        method: "GET",
        headers: { "user-agent": "node.js" },
      };
  
      request(options, (error, response, body) => {
        if (error) console.error(error);
  
        if (response.statusCode != 200) {
          res.status(404).json({ msg: "No github profile found" });
        }
  
        res.json(JSON.parse(body));
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

  /**
 * @route GET api/profile/user/:user_id
 * @desc Get profile by user ID
 * @access Public
 */
router.get("/user/:user_id",async(req,res)=>{
    try{
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate("user",["name","avatar"])
    }catch(err){
        console.error(err.message)
        if(err.kind == "ObjectId"){
            return res.status(400).json({msg:"Profile not found"})
        }
        res.status(500).send("Server Error")
    }
})

module.exports = router;

/**
 * populate
 * -다른 도큐멘트의 ObjectId를 사용하여 실제 객체로 치환하는 작업
 * Profile.findOne({}).populate('필드명','참조객체의 필드')
 * .populate('필드명',['참조객체의 필드1','참조객체의 필드2'])는 배열로 참조객체의 필드가 함꼐 나온다.
 * .populate('필드명1').populate('필드명2') 이렇게 모두 치환할수도 있다.
 */