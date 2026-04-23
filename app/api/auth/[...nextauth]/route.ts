import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import twilio from 'twilio';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
  const { siteId, name, phone, email, message } = await req.json();
  
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: { user: true }
  });

  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  // Monetization Logic: Tier Check
  if (site.user.tier === 'FREE' && site.leadsCount >= 10) {
    return NextResponse.json({ error: "Lead limit reached. Upgrade to Growth tier." }, { status: 403 });
  }

  // Save Lead
  const lead = await prisma.lead.create({
    data: { siteId, name, phone, email, message }
  });

  await prisma.site.update({
    where: { id: siteId },
    data: { leadsCount: { increment: 1 } }
  });

  // Free & Growth: Email Notification
  await resend.emails.send({
    from: 'leads@yourdomain.com',
    to: site.user.email!,
    subject: `New Lead for ${site.businessName}`,
    html: `<p>New lead: ${name} - ${phone} - ${message}</p>`
  });

  // Growth Tier: SMS Notification
  if (site.user.tier === 'GROWTH' && phone) {
    await twilioClient.messages.create({
      body: `New Landscaping Lead: ${name}. Call: ${phone}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: site.user.email! // Assuming we store user phone in DB in prod
    });
  }

  return NextResponse.json({ success: true, lead });
}