import axios from "axios";
import { cookies } from "next/headers";

export async function serverApi() {
  const cookieStore = cookies();
  const jwtToken = (await cookieStore).get("jwt_token")?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(jwtToken ? { Cookie: `jwt_token=${jwtToken}` } : {}),
    },
    withCredentials: true,
  });
}
