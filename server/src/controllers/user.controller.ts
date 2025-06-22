import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util";
import { loginSchema, userSchema } from "../validation/validate";
import bcrypt from "bcrypt";
import { prismaClient } from "../db";

/** User Registration 
 * @route POST /api/v1/user/register
 * @desc Register a new user
 * @access Public
*/
export const registerUser = asyncHandler(async (req: Request, res:Response) => {
    const payLoad = req.body;
    const result = userSchema.safeParse(payLoad);

    if(!result.success){
        return res.status(400).json({
            messsage: "Input is wrong for registration",
            error: result.error.errors
        })
    }

    const { email, name, password, pic } = result.data;

    const isUserExists = await prismaClient.user.findUnique({
        where: {
            email: email
        }
    })

    if (isUserExists){
        return res.status(400).json({
            message: "User already exists with this email"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await prismaClient.user.create({
        data: {
            name: name,
            email:email,
            password: hashedPassword,
            pic: pic
        }
    })

    return res.status(201).json({
        message: "User registered successfully",
        user: newUser
    })
})


/** User Login
 * @route POST /api/v1/user/login
 * @desc Login a user
 * @access Public
*/
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const payLoad = req.body;
    const result = loginSchema.safeParse(payLoad);

    if (!result.success) {
        return res.status(400).json({
            message: "Input is wrong for login",
            error: result.error.errors
        });
    }

    const { email, password } = result.data;

    const user = await prismaClient.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        });
    }

    return res.status(200).json({
        message: "Login successful",
        user: user
    });
})

