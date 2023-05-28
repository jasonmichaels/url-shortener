import { NextApiResponse, NextApiRequest } from "next";

import { IDoc, queryForShortUrl } from '@url-shortener/utils/FirebaseUtil';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { shortUrl, longUrl } = 'string' === typeof req.body ? JSON.parse(req.body) : req.body;

    if ([shortUrl, longUrl].some((v) => 'string' === typeof v && v.length)) {
      try {
        const data = await queryForShortUrl({ shortUrl, longUrl } as IDoc);
  
        return res.status(200).json(data);
      } catch (e) {
        res.status(500).json({ error: 'Network error.' });
      }
    } else {
      res.status(400).json({ error: 'Incorrect body specified.' })
    }
  } else {
    res.status(403).json({ error: `Performed a ${req.method} request, POST required.` });
  }
}