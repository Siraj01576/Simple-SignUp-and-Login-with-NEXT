import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { error } from "console";

const secret = "12345678"

const prisma = new PrismaClient();

const createUserSchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("kasd")
    const result = createUserSchema.safeParse(body);

    if(!result.success){
        return NextResponse.json({
          success: "false",
          message: "input incorrect"
        })
    }

    const exist = await prisma.user.findUnique({
      where: {
        username:body.username
      },
    });    
    if(exist){
      return NextResponse.json({
        success: "false",
        message : "user already exist"
      })
    }
    const user = await prisma.user.create({
      data: {
        name: result.data.name,
        username: result.data.username,
        password: result.data.password,
      },
    });

    console.log(user)

    const token = jwt.sign({ username:body.username }, secret, {
      expiresIn: "1h",
    });
    console.log(token)
    return NextResponse.json({
      success: "true",
      token: token
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
