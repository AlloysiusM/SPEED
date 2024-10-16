import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { title, author, url } = req.body;

    // For now, just log the received data
    console.log("Article submitted:", { title, author, url });

    res.status(200).json({ message: "Article submitted successfully!" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}