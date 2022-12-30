import httpProxy from "http-proxy";
import type { NextApiHandler } from "next";
import { env } from "../../../../env/server.mjs";
import { getServerAuthSession } from "../../../../server/common/get-server-auth-session";
import { prisma } from "../../../../server/db/client";

const API_URL = env.STORAGE_SERVER_URL;

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(400).end();
    return;
  }

  const collection = req.query.collection as string;

  const noteId = ~~collection;

  if (noteId === 0) return res.status(400).end();

  const session = await getServerAuthSession({ req, res });

  if (!session) return res.status(500).end();
  if (!session.user) return res.status(500).end();

  const userId = session.user.id;

  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) return res.status(403).end();

  const target = `${API_URL}/upload/${req.query.collection}`;

  return new Promise((resolve, reject) => {
    proxy.web(req, res, { target, ignorePath: true }, async (err) => {
      if (err) {
        return reject(err);
      }

      resolve(undefined);
    });
  });
};

export default handler;
