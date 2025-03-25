import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/helpers/app.helpers.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");
  await prisma.systemUsersInfo.deleteMany();
  await prisma.userType.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.userLibrary.deleteMany();
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();

  const adminUserType = await prisma.userType.create({
    data: { name: "Admin" },
  });

  const userUserType = await prisma.userType.create({
    data: { name: "User" },
  });

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

  const categories = await prisma.category.createMany({
    data: [
      {
        name: "Fiction",
        description:
          "Explore a world of imagination with our vast collection of fiction books.",
      },
      {
        name: "Non-Fiction",
        description:
          "Discover real stories, facts, and knowledge across various subjects.",
      },
      {
        name: "Science Fiction",
        description:
          "Futuristic and mind-bending stories about space, technology, and beyond.",
      },
      {
        name: "Fantasy",
        description:
          "Dive into magical realms, epic adventures, and mythical creatures.",
      },
      {
        name: "Mystery",
        description:
          "Unravel thrilling mysteries and intriguing detective stories.",
      },
      {
        name: "Biography",
        description:
          "Read about the lives and achievements of inspiring personalities.",
      },
      {
        name: "Self-Help",
        description:
          "Improve your life with books on personal development and motivation.",
      },
      {
        name: "History",
        description:
          "Explore significant events and civilizations from the past.",
      },
      {
        name: "Romance",
        description: "Heartwarming and passionate love stories to indulge in.",
      },
      {
        name: "Horror",
        description:
          "Spine-chilling tales to keep you on the edge of your seat.",
      },
      {
        name: "Business",
        description:
          "Learn about entrepreneurship, leadership, and financial success.",
      },
      {
        name: "Health & Wellness",
        description: "Guides on fitness, nutrition, and mental well-being.",
      },
      {
        name: "Technology",
        description:
          "Stay updated with the latest trends in tech and innovation.",
      },
      {
        name: "Education",
        description: "Resources for learning and academic growth.",
      },
      {
        name: "Poetry",
        description:
          "A collection of beautiful verses and literary expressions.",
      },
    ],
  });

  console.log("Categories created");
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
