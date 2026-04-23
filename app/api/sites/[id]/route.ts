import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, params must be awaited
  const { id } = await params;
  
  const site = await prisma.site.findUnique({
    where: { id: id }
  });

  return NextResponse.json(site);
}