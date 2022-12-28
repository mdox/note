#!/bin/ts-node

import { PrismaClient } from "@prisma/client";

const email = process.argv[2] || process.exit(1);

const prisma = new PrismaClient();

async function main() {
  await prisma.user.delete({
    where: { email },
  });
}

main();
