import express,{Request,Response} from 'express'
import config from '../config'
import request from 'request'
import Profile from '../models/Profile'
import auth from '../middleware/auth'
import { check, validationResult } from 'express-validator'

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

/**
 *  @route PUT api/profile/experience
 *  @desc Add profile experience
 *  @access Private
 */
 router.put(
    "/experience",
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From data is required").not().isEmpty(),
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      } = req.body;
  
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      };
  
      try {
        const profile = await Profile.findOne({ user: req.body.user.id });
        profile.experience.unshift(newExp); //profile??? ?????? ??????????????? ????????? newExp????????? ??????
        await profile.save();
        res.json(profile);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  );

  /**
 *  @route PUT api/profile/education
 *  @desc Add profile education
 *  @access Private
 */
router.put(
    "/education",
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      } = req.body;
  
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  );

module.exports = router;

/**
 * populate
 * -?????? ??????????????? ObjectId??? ???????????? ?????? ????????? ???????????? ??????
 * Profile.findOne({}).populate('?????????','??????????????? ??????')
 * .populate('?????????',['??????????????? ??????1','??????????????? ??????2'])??? ????????? ??????????????? ????????? ?????? ?????????.
 * .populate('?????????1').populate('?????????2') ????????? ?????? ??????????????? ??????.
 */