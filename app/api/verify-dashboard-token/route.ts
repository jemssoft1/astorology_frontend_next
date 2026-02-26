// app/api/verify-dashboard-token/route.ts (Domain B)
// Verifies the accessToken sent from Domain A using the same JWT_SECRET
// as the NodeJS backend — no separate shared secret required.
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 400 });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("Server configuration error: JWT_SECRET is missing.");
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }

    // Verify using the same JWT_SECRET the NodeJS backend uses
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Extract user data from the decoded payload
    const userId = decoded.sub || decoded.userId || decoded.id;
    const userEmail = decoded.email;
    const userName = decoded.username || decoded.name;
    const userApiKey = decoded.apikey;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID missing from token" },
        { status: 400 },
      );
    }

    // Set the accessToken as a cookie so Domain B is authenticated
    const cookieStore = await cookies();
    cookieStore.set("accessToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7200, // 2 hours
    });

    return NextResponse.json({
      success: true,
      data: { userId, userEmail, userName, userApiKey },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
