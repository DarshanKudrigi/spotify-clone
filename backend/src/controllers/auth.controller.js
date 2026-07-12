const usermodel = require("../models/user.model");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");  


async function registeruser(req, res) {
    const {username,email,password,role="user"} = req.body;


    try{
        const existingUser = await usermodel.findOne({email});

        query =
        { $or: 
            [{email}, {username}] 
        };

        if(existingUser){
            return res.status(400).json({message:"User already exist"});
        }


    }
    finally{
        console.log("Error checking existing user");
    }
    const hashpassword = await bcrypt.hash(password, 10);

    const user = await usermodel.create({username,email,password:hashpassword,role});

    const token = jwt.sign({
        id:user._id,
        role:user.role
    }, process.env.JWT_SECRET
    );

    res.cookie("token", token);

    res.status(201).json({message:"User registered successfully", 
        user:{username:user.username,email:user.email,role:user.role}
});

}


async function loginuser(req,res){

    const {email,username,password} = req.body;

    const user =  await usermodel.findOne({
        $or: [{email}, {username}]
    });

    if(!user){
        return res.status(400).json({message:"Invalid credentials"});
    }

    const isMatch = await bcrypt.compare(password, user.password);


    if(!isMatch){
        return res.status(400).json({message:" credentials passwords do not match to the correct one!!"});
    }
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials passwords do not match"});
    }

    const token = jwt.sign({
        id:user.id,
        role:user.role
    }, process.env.JWT_SECRET
    );

    res.cookie("token", token);

    res.status(200).json({message:"User logged in successfully", 
        user:
        {
            username:user.username,
            email:user.email,
            role:user.role
        }
    });
}




module.exports = {registeruser, loginuser};