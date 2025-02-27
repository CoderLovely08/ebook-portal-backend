import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userType = await prisma.userType.createMany({
    data: [{ name: "SuperAdmin" }, { name: "Admin" }, { name: "User" }],
  });
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
