const express = require("express");
const router = express.Router();
const book = require('../modules/bookmodule');
const booksTransaction = require('../modules/bookstransaction');
const mongoose = require('mongoose');


router.post('/',async(req,res)=>{
    try {
        const addData = new booksTransaction(req.body);

        const saveData = await addData.save();
        res.status(200).json(saveData);
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error!')
    }
})

router.put('/:id', async(req,res)=>{
    //console.log(req.params);
    try {
        const data = await booksTransaction.findByIdAndUpdate(req.params.id,{
            $set: req.body
        });
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error!')
    }
})

router.get('/find/', async(req,res)=>{
    //console.log(req.query);
    try {
        const data = await booksTransaction.aggregate([
            {
                $match: {
                    book_id: req.query.book_id,
                    userId: req.query.user_id,
                    $or: [
                        { returndate: null }, // Check for null
                        { returndate: { $exists: false } } // Check for non-existence
                    ]
                }
            },
            {
                $lookup: {
                    from: "books", // Name of the books collection
                    let: { bookId: "$book_id" }, // Define a variable for the lookup
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toString: "$_id" }, "$$bookId"] // Convert ObjectId to string for comparison
                                }
                            }
                        }
                    ],
                    as: "bookInfo"
                }
            },
            {
                $unwind: "$bookInfo" // Deconstruct the array returned by $lookup
            },
            {
                $lookup: {
                    from: "users", // Name of the users collection
                    localField: "userId",
                    foreignField: "userId",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo" // Deconstruct the array returned by $lookup
            },
            {
                $project: {
                    _id: 1, // include the transaction ID if not needed
                    bookName: "$bookInfo.book_name", // Return the book name
                    userName: "$userInfo.user_name",
                    issuedate: 1
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error!')
    }
})

router.get('/bookSearchTransactions/:id', async(req,res)=>{
     //console.log(req.params);
    try {
        const data = await booksTransaction.aggregate([
            {
                $match: {
                    book_id: req.params.id
                }
            },
            {
                $facet: {
                    totalPastIssues: [
                        { 
                            $match: { 
                                returndate: { $ne: null } // Count books that have been returned (past issues)
                            }
                        },
                        { 
                            $count: "totalPastIssues" // Count total past issues
                        }
                    ],
                    totalPresentIssues: [
                        {
                            $match: { 
                                returndate: null // Count books that have not been returned (current issues)
                            }
                        },
                        {
                            $count: "totalPresentIssues" // Count total present issues
                        }
                    ],
                    totalRentGenerated: [
                        {
                            $match: {
                                returndate: { $ne: null } // Ensure that only returned books are considered
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalRent: { $sum: "$totalRent" } // Sum the totalRent field
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                totalRent: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    totalPastIssues: { $arrayElemAt: ["$totalPastIssues.totalPastIssues", 0] },
                    totalPresentIssues: { $arrayElemAt: ["$totalPresentIssues.totalPresentIssues", 0] },
                    totalRentGenerated: { $arrayElemAt: ["$totalRentGenerated.totalRent", 0] }
                }
            }
        ]);
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json('Internal Server Error!');
    }
})

router.get('/bookSearchDateTransactions/?', async(req,res)=>{
    console.log(req.query);
    const from = new Date(req.query.from)
    const to = new Date(req.query.to)
   try {
       const data = await booksTransaction.aggregate([
        {
            $match: {
                issuedate: { $gte: from, $lte: to } // Filter by issuedate in the specified range
            }
        },
        {
            $lookup: {
                from: "books", // Join with books collection
                let: { bookId: "$book_id" }, // Define a variable for the lookup
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toString: "$_id" }, "$$bookId"] // Convert ObjectId to string for comparison
                                }
                            }
                        }
                    ], // Field in books
                as: "bookInfo" // Output array field
            }
        },
        {
            $unwind: "$bookInfo" // Deconstruct bookInfo array to access fields directly
        },
        {
            $lookup: {
                from: "users", // Join with users collection
                localField: "userId", // Field in booksTransaction
                foreignField: "userId", // Field in users
                as: "userInfo" // Output array field
            }
        },
        {
            $unwind: "$userInfo" // Deconstruct userInfo array to access fields directly
        },
        {
            $project: {
                _id: 0, // Exclude the transaction ID if not needed
                bookName: "$bookInfo.book_name", // Include the book name
                userName: "$userInfo.user_name", // Include the user name
                issuedate: 1, // Include issuedate if needed
                returndate: 1 // Include returndate to know if returned or not
            }
        }
    ]);
       console.log(data);
       res.status(200).json(data);
   } catch (error) {
       res.status(500).json('Internal Server Error!');
   }
})



router.get('/userDatas/:id', async(req,res)=>{
    //console.log(req.params)
    try {
        const data = await booksTransaction.aggregate([
            {
                $match: {
                    userId: req.params.id // Replace with the userId you want to search for
                }
            },
            {
                $lookup: {
                    from: "books", // Name of the books collection
                    let: { bookId: "$book_id" }, // Define a variable for the lookup
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [{ $toString: "$_id" }, "$$bookId"] // Convert ObjectId to string for comparison
                                }
                            }
                        }
                    ],
                    as: "bookDetails" // Alias for the joined data
                }
            },
            {
                $unwind: "$bookDetails" // Deconstruct the array returned by $lookup
            },
            {
                $project: {
                    _id: 0, // Exclude the transaction ID if not needed
                    bookName: "$bookDetails.book_name", // Return the book name
                    issuedate: 1, // Return the issued date from the transaction
                    returndate: 1 // Return the return date (null if not returned)
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json('Internal Server Error');

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