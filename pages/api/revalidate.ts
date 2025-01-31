import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(403).send("Forbidden");
  }

  try {
    const revalidateUrls = ["/statistika", "/pretraga", "/mapa", "/indeks"].map(
      (url) => res.revalidate(url)
    );
    await Promise.all(revalidateUrls);
    return res.json({ revalidated: true });
  } catch {
    return res.status(500).send("Error in revalidation");
  }
}
