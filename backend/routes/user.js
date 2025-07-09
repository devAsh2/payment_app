const express = require('express');
const router = express.Router();
const z = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware");
const {Account} = require("../db");

// define the schema using zod
const signupBody = z.object({
  username: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

router.post("/signup", async (req, res) => {
  console.log("received signup request with body", req.body);
  const { success } = signupBody.safeParse(req.body);
  console.log("zod validation result:",success);
  

  if (!success) {
    console.error("Zod validation failed!");
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    console.error("User with this email already exists.");
    return res.status(411).json({
      message: "Email already taken/Incorrect inputs",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;


  // -- Create an acccount for the user with a random balance
  await Account.create({
    userId: userId,
    balance: Math.ceil(Math.random() * 10000),
  });
  // ---------------------------------------------------------

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

const signinBody = z.object({
  username: z.string().email(),
  password: z.string(),
});

router.post("/signin", async (req,res)=>{
    const { success } = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
          message: "Incorrect inputs",
        });
    }

    const existingUser = await User.findOne({
      username: req.body.username,
      password: req.body.password
    });
    if(existingUser){
        const token = jwt.sign({
            userId: existingUser._id
        }, JWT_SECRET);

        return res.json({
            message: "User signed in successfully",
            token: token
        })
    }
    res.status(411).json({
      message: "Error while logging in",
    });
})

//let the user update their details
const updateBody = z.object({
    password: z.string().optional,
    firstName:z.string().optional,
    lastName:z.string().optional
}
)
router.put("/", authMiddleware, async (req, res)=>{
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs",    
        });
    }

    await User.updateOne({
        _id:req.userId
    })

    res.json({
        message: "user updated successfully"
    })
})

router.get("/bulk", async (req, res)=>{
    const filter = req.query.filter || "";
    // Find matching users from the database and store in users variable
    const users = await User.find({
      $or: [
        { 
            firstName: { "$regex": filter } 
        },

        {
          lastName: { "$regex": filter },
        },
      ],
    });

    // Return the response 
    res.json({
        user: users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})



module.exports = router;