import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Product 1',
        description: 'Description for Product 1',
        price: 19.99,
        userId: user1.id,
      },
      {
        name: 'Product 2',
        description: 'Description for Product 2',
        price: 29.99,
        userId: user1.id,
      },
      {
        name: 'Product 3',
        description: 'Description for Product 3',
        price: 39.99,
        userId: user2.id,
      },
      {
        name: 'Product 4',
        description: 'Description for Product 4',
        price: 49.99,
        userId: user2.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });