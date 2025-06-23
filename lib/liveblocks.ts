import { Liveblocks } from "@liveblocks/node";

const secret = process.env.LIVEBLOCKS_SECRET_KEY as string || "";

export const liveblocks = new Liveblocks({ secret });