// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  // create dummy user
  const user = await prisma.user.create({
    data: {
      email: 'saeedkargosha@gmail.com',
      password: '1234567890',
      firstname: 'Saeed',
      lastname: 'Kargosha',
      avatar: null,
    },
  });
  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
