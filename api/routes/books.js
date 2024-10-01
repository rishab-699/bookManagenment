const express = require("express");
const router = express.Router();
const book = require('../modules/bookmodule');

router.get("/search", async(req,res)=>{
    //console.log(req.query.searchValue);
    const search = req.query.searchValue;
    try {
        let result;
        const data = await book.find({$or:[{book_name: { $regex: search, $options: 'i' }},
            {category: { $regex: search, $options: 'i' }}]});

        //console.log(data);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error!')
    }
})
router.get("/", async(req,res)=>{
    try {
        const data = await book.find();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error!')
    }
})


module.exports = router