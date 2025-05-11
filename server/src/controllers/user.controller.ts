import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.util";
import { userSchema } from "../validation/validate";
import { Request, Response } from "express";
import { prismaClient } from "../db";


const registerUser = asyncHandler(async (req: Request, res: Response)=> {
    const parsedBody = userSchema.safeParse(req.body);
    if(!parsedBody.success) {
        res.status(400).json({
            success: false,
            message: parsedBody.error.errors[0].message,
        });
        return;
    }

    const data = prismaClient.user.create({
        data:{
            name: parsedBody.data.name,
            email: parsedBody.data.email,
            phone: parsedBody.data.phone,
            password: parsedBody.data.password,
        }
    })

})
