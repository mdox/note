#!/bin/ts-node

import { PrismaClient } from "@prisma/client";

const noteId = ~~process.argv[2] || process.exit(1);

const prisma = new PrismaClient();

async function main() {
  await prisma.note.delete({
    where: { id: noteId },
  });
}

main();
