import { NextApiResponse, NextApiRequest } from "next";

import { IDoc, incrementUrlRequests } from '@url-shortener/utils/FirebaseUtil';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id } = 'string' === typeof req.body ? JSON.parse(req.body) : req.body;

      try {
        await incrementUrlRequests(id);
  
        res.status(200).json({ success: true });
      } catch (e) {
        res.status(500).json({ error: 'Network error.' });
      }
  } else {
    res.status(403).json({ error: `Performed a ${req.method} request, POST required.` });
  }
}