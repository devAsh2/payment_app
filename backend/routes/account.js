const express = require("express")
const mongoose = require("mongoose");
const router = express.Router();
const authMiddleware = require("../middleware");
const {Account} = require('../db')

//route to get the user balance
router.get('/balance', authMiddleware,async (req,res)=>{
    const userId = req.userId;
    const account = await Account.findOne({
        userId: userId
    })

    // return the json response containing the balance
    res.json({
        balance: account.balance
    })
})

//An endpoint for user to transfer money to another account
router.post('/transfer', authMiddleware, async (req,res)=>{
    //used transaction API of mongoose to ensure transaction rollsback if any error in middle of the process occurs
    const session = await mongoose.startSession();
    session.startTransaction();
    const {amount,to} = req.body;
    console.log("user id :", req.userId);

    // Fetch the account within the transaction
    const fromAccount = await Account.findOne({userId:req.userId}).session(session);
    console.log(fromAccount.balance);
    //validate the balance exists in from account or not
    if(!fromAccount||fromAccount.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    // Fetch the to account within the transaction
    const toAccount = await Account.findOne({userId:to}).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    // Perform the transfer
    await Account.updateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session);
    await Account.updateOne({userId: to}, {$inc: {balance: amount}}).session(session);

    //commit the transaction
    await session.commitTransaction();

    

    res.json({
      message: "Transfer successful",
    });
})

//transfer logic to send twice transfer req to same usser at same time to test purpose. Error should be thrown
// async function transfer(req) {
//   const session = await mongoose.startSession();

//   session.startTransaction();
//   const { amount, to } = req.body;

//   // Fetch the accounts within the transaction
//   const account = await Account.findOne({ userId: req.userId }).session(
//     session
//   );

//   if (!account || account.balance < amount) {
//     await session.abortTransaction();
//     console.log("Insufficient balance");
//     return;
//   }

//   const toAccount = await Account.findOne({ userId: to }).session(session);

//   if (!toAccount) {
//     await session.abortTransaction();
//     console.log("Invalid account");
//     return;
//   }

//   // Perform the transfer
//   await Account.updateOne(
//     { userId: req.userId },
//     { $inc: { balance: -amount } }
//   ).session(session);
//   await Account.updateOne(
//     { userId: to },
//     { $inc: { balance: amount } }
//   ).session(session);

//   // Commit the transaction
//   await session.commitTransaction();
//   console.log("done");
// }

// transfer({
//   userId: "684067656872e2b59718f94b",
//   body: {
//     to: "684066826872e2b59718f944",
//     amount: 100,
//   },
// });

// transfer({
//   userId: "684067656872e2b59718f94b",
//   body: {
//     to: "684066826872e2b59718f944",
//     amount: 100,
//   },
// });

module.exports = router;

