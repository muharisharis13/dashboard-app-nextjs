import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/api/inventory/:path*", "/api/user/:path*"],
};

export async function middleware(request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.redirect(
      new URL("/api/auth/unauthorized", request.url)
    );
  }
  // else {
  //   const decoded = jwt_decode(token)
  //   if (!decoded?.exp > new Date().getTime() === false) {
  //     const refreshToken = request.cookies.get("refreshToken")?.value
  //     const username = request.cookies.get("username")?.value
  //     await fetch('http://localhost:3000/api/auth/refreshToken', {
  //       method: 'POST',
  //       body: JSON.stringify({ username, refreshToken }),
  //     })
  //       .then(res => res.json())
  //       .then((result) => {
  //         console.log({ result })
  //         if (result?.code === 200) {
  //           Cookies.set("token", result.data.token)
  //           // NextResponse.next().cookies.set("token", result?.data?.token)
  //           NextResponse.next().cookies.set("refreshToken", result?.data?.refreshToken)
  //         }
  //       })

  //     // console.log({ data, username, refreshToken })
  //   }
  // }

  return NextResponse.next();
}
