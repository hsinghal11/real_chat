import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.util";
import { userSchema, loginSchema } from "../validation/validate";
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../db";
import bcrypt from "bcrypt";
import { PassThrough } from "stream";

const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.REFERESH_TOKEN_SECRET as string,
    {
      expiresIn: "1m",
    }
  );
};

const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  console.log("Register User");
  const parsedBody = userSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      success: false,
      message: parsedBody.error.errors[0].message,
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(parsedBody.data.password, 10);

  const data = await prismaClient.user.create({
    data: {
      name: parsedBody.data.name,
      email: parsedBody.data.email,
      phone: parsedBody.data.phone,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data : data,
  })
});

const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedBody = loginSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        success: false,
        message: parsedBody.error.errors[0].message,
      });
      return;
    }
  
    console.log(parsedBody);
  
    const user = await prismaClient.user.findFirst({
      where:{
          OR: [
              {
                  email: parsedBody.data.email
              },
              {
                  phone: parsedBody.data.phone
              }
          ]
      }
    });
  
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid Email or Phone",
      });
      return;
    }
  
    const isPasswordValid = await bcrypt.compare(
      parsedBody.data.password,
      user.password
    );
  
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "password is not correct",
      });
      return;
    }
  
    const refreshToken = generateRefreshToken(user.id);
  
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  
    const userWithRefreshToken = await prismaClient.user.update({
      where:{
          id: user.id,
      },
      data:{
          refreshToken: refreshToken
      }
    }) 
  
    res.status(200).json({
      success: true,
      message: "Login successful",
      data : userWithRefreshToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    
  }
});


export { registerUser, loginUser };