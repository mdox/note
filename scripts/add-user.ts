#!/bin/ts-node

import { PrismaClient } from "@prisma/client";

const name = process.argv[2] || process.exit(1);
const email = process.argv[3] || process.exit(1);

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email },
    create: { name, email },
    update: {},
  });
}

main();
