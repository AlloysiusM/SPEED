import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { title, author, url } = req.body;

    // For now, just log the received data
    console.log("Article submitted:", { title, author, url });

    // Here you can implement saving the data to your database
    // For example, using MongoDB if that's your backend

    res.status(200).json({ message: "Article submitted successfully!" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}