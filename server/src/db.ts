import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
}

export const prismaClient = globalForPrisma.prisma || new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;