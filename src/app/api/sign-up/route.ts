import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

sendVerificationEmail;

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const exisitingUserVerifiedByUserName = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (exisitingUserVerifiedByUserName) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const exisitingUserVerifiedByEmaill = await UserModel.findOne({ email });
    const verifyCode = Math.floor(1000000 + Math.random() * 900000).toString();
    if (exisitingUserVerifiedByEmaill) {
      if (exisitingUserVerifiedByEmaill.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exisits with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        exisitingUserVerifiedByEmaill.password = hashedPassword;
        exisitingUserVerifiedByEmaill.verifyCode = verifyCode;
        exisitingUserVerifiedByEmaill.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );

        await exisitingUserVerifiedByEmaill.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        isVerified: false,
        message: [],
      });

      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse) {
      return Response.json(
        {
          success: true,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully,Please verify email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
