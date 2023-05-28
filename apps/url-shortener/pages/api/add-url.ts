import { NextApiResponse, NextApiRequest } from "next";

import { addToUrls } from "@url-shortener/utils/FirebaseUtil";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { longUrl } = 'string' === typeof req.body ? JSON.parse(req.body) : req.body;

    if ('string' === typeof longUrl && longUrl.length) {
      try {
        const data = await addToUrls(longUrl);
  
        res.status(200).json(data);

      } catch (e) {
        res.status(500).json({ error: 'Network error.'})
      }
    } else {
      res.status(400).json({ error: 'The URL was not specified.' })
    }
  } else {
    res.status(403).json({ error: `Performed a ${req.method} request, POST required.` });
  }
}