import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const marketSlugs = [
  'wheat',
  'corn',
  'soy',
  'sunflower-meal',
  'sunflower-seed',
  'sunflower-oil',
  'pork-half-carcass',
] as const;

async function main(): Promise<void> {
  await prisma.auditLog.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.otcDeal.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.onboardingDocument.deleteMany();
  await prisma.onboardingCase.deleteMany();
  await prisma.orgMembership.deleteMany();
  await prisma.document.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.pricePoint.deleteMany();
  await prisma.indexPoint.deleteMany();
  await prisma.contractSpec.deleteMany();
  await prisma.market.deleteMany();
  await prisma.index.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      fullName: 'Platform Admin',
      passwordHash: await bcrypt.hash('Admin123!', 10),
      emailVerifiedAt: new Date(),
    },
  });

  const demoOrg = await prisma.organization.create({
    data: {
      name: 'Demo Agro LLC',
      inn: '7700000000',
      status: 'approved',
    },
  });

  const demoUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'owner@example.com',
        fullName: 'Org Owner',
        passwordHash: await bcrypt.hash('Admin123!', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'trader@example.com',
        fullName: 'Trader User',
        passwordHash: await bcrypt.hash('Admin123!', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'compliance@example.com',
        fullName: 'Compliance User',
        passwordHash: await bcrypt.hash('Admin123!', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'viewer@example.com',
        fullName: 'Viewer User',
        passwordHash: await bcrypt.hash('Admin123!', 10),
      },
    }),
  ]);

  await prisma.orgMembership.createMany({
    data: [
      { userId: admin.id, organizationId: demoOrg.id, role: Role.admin },
      { userId: demoUsers[0].id, organizationId: demoOrg.id, role: Role.org_admin },
      { userId: demoUsers[1].id, organizationId: demoOrg.id, role: Role.trader },
      { userId: demoUsers[2].id, organizationId: demoOrg.id, role: Role.compliance },
      { userId: demoUsers[3].id, organizationId: demoOrg.id, role: Role.viewer },
    ],
  });

  const markets = await Promise.all(
    marketSlugs.map((slug, idx) =>
      prisma.market.create({
        data: {
          slug,
          title: `Market ${slug}`,
          description: `Описание рынка ${slug}`,
          tags: ['agro', slug],
          contractSpecs: {
            create: {
              version: '1.0.0',
              params: {
                lot: 10 + idx,
                deliveryBasis: 'EXW',
                moisture: '12%',
              },
              tariff: 100 + idx * 5,
              effectiveDate: new Date(),
            },
          },
        },
      }),
    ),
  );

  const indices = await Promise.all(
    ['grain-composite', 'oilseed-composite', 'meat-composite'].map((slug) =>
      prisma.index.create({
        data: {
          slug,
          title: `Index ${slug}`,
          methodology: `Methodology for ${slug}`,
        },
      }),
    ),
  );

  for (let day = 0; day < 90; day += 1) {
    const date = new Date();
    date.setDate(date.getDate() - (89 - day));

    await prisma.pricePoint.createMany({
      data: markets.map((market, idx) => ({
        marketId: market.id,
        date,
        value: 10000 + idx * 500 + day * 10,
      })),
    });

    await prisma.indexPoint.createMany({
      data: indices.map((index, idx) => ({
        indexId: index.id,
        date,
        value: 1000 + idx * 100 + day * 2,
      })),
    });
  }

  await prisma.document.createMany({
    data: Array.from({ length: 10 }).map((_, idx) => ({
      slug: `doc-${idx + 1}`,
      title: `Документ ${idx + 1}`,
      category: idx % 2 === 0 ? 'rules' : 'methodology',
      version: `1.${idx}`,
      effectiveDate: new Date(Date.now() - idx * 86400000),
      tags: ['public', idx % 2 === 0 ? 'rules' : 'guide'],
      marketId: markets[idx % markets.length].id,
      fileUrl: null,
    })),
  });

  await prisma.newsArticle.createMany({
    data: Array.from({ length: 10 }).map((_, idx) => ({
      slug: `news-${idx + 1}`,
      title: `Новость ${idx + 1}`,
      summary: `Краткое описание новости ${idx + 1}`,
      body: `Полный текст новости ${idx + 1}`,
      tags: ['market', 'update'],
      publishedAt: new Date(Date.now() - idx * 86400000),
    })),
  });

  const onboardingCase = await prisma.onboardingCase.create({
    data: {
      organizationId: demoOrg.id,
      createdById: demoUsers[0].id,
      status: 'in_review',
      checklist: {
        profile: true,
        documents: false,
        approvals: false,
      },
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'seed.bootstrap',
        entityType: 'system',
        payload: { ok: true },
      },
      {
        userId: demoUsers[0].id,
        action: 'onboarding.case.created',
        entityType: 'onboarding_case',
        entityId: onboardingCase.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
