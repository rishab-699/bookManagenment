const express = require("express");
const router = express.Router();
const book = require('../modules/bookmodule');
const user = require('../modules/usermodule');

router.post('/',async(req,res)=>{
    try {
        //console.log(req.body);
        const userData = new user(req.body);

        const saveData = await userData.save();
        res.status(200).json(saveData);
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error!')
    }
})
router.get("/", async(req,res)=>{
    try {
        const data = await user.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error!')
    }
})


module.exports = router