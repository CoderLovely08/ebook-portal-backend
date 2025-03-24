import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/helpers/app.helpers.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.userType.deleteMany();

  const adminUserType = await prisma.userType.create({
    data: { name: "Admin" },
  });

  const userUserType = await prisma.userType.create({
    data: { name: "User" },
  });

  console.log("User types created");

  const hashedPassword = hashPassword("Pass@1234");

  // Create default admin
  const admin = await prisma.systemUsersInfo.create({
    data: {
      email: "admin@gmail.com",
      fullName: "Admin",
      password: hashedPassword,
      userType: {
        connect: {
          id: adminUserType.id,
        },
      },
    },
  });

  console.log("Admin created");
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
