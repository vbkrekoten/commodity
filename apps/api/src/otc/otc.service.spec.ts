import { Test } from '@nestjs/testing';
import { PrismaService } from '../common/prisma.service';
import { OtcService } from './otc.service';

describe('OtcService', () => {
  let service: OtcService;

  const prismaMock = {
    otcDeal: {
      createMany: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OtcService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = moduleRef.get(OtcService);
  });

  it('imports csv rows', async () => {
    const csv = 'marketSlug,volume,price,dealDate\nwheat,10,100,2026-01-01';
    const result = await service.importCsv('org1', 'user1', csv);
    expect(result.created).toBe(1);
  });
});
