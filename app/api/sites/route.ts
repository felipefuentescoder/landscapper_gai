import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();

  // 1. Create a dummy user (since we are testing without logging in via Google yet)
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: { email: "tester@landscaper.com" } });
  }

  // 2. Save the new site to the database
  const site = await prisma.site.create({
    data: {
      userId: user.id,
      template: body.template,
      businessName: body.businessName,
      heroText: body.heroText,
      services: "Landscaping", // Default string since SQLite doesn't support arrays
    }
  });

  return NextResponse.json(site);
}