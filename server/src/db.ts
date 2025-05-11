import { PrismaClient } from "./generated/prisma";

const prismaClient = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

export { prismaClient };