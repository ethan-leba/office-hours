import { OpenQuestionStatus, LimboQuestionStatus } from '@koh/common';
import { Test, TestingModule } from '@nestjs/testing';
import moment = require('moment');
import { Connection } from 'typeorm';
import {
  ClosedOfficeHourFactory,
  OfficeHourFactory,
  QuestionFactory,
  QueueFactory,
  UserFactory,
} from '../../../test/util/factories';
import { TestTypeOrmModule } from '../../../test/util/testUtils';
import { QuestionModel } from '../../question/question.entity';
import { QueueCleanService } from './queue-clean.service';

describe('QueueService', () => {
  let service: QueueCleanService;
  let conn: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestTypeOrmModule],
      providers: [QueueCleanService],
    }).compile();
    service = module.get<QueueCleanService>(QueueCleanService);
    conn = module.get<Connection>(Connection);
  });

  afterAll(async () => {
    await conn.close();
  });

  beforeEach(async () => {
    await conn.synchronize(true);
  });

  describe('shouldCleanQueue', () => {
    it('returns true when no staff, 1 question, and no other office hours', async () => {
      const queue = await QueueFactory.create({ officeHours: [] });
      await QuestionFactory.create({
        status: OpenQuestionStatus.Queued,
        queue: queue,
      });
      expect(await service.shouldCleanQueue(queue)).toBeTruthy();
    });

    it('returns false when no staff, 1 question, but other office hours soon', async () => {
      const queue = await QueueFactory.create();
      await QuestionFactory.create({
        status: OpenQuestionStatus.Queued,
        queue: queue,
      });
      await OfficeHourFactory.create({
        startTime: moment().add(10, 'minutes').toDate(),
        endTime: moment().add(30, 'minutes').toDate(),
      });
      expect(await service.shouldCleanQueue(queue)).toBeFalsy();
    });
  });

  describe('cleanQueue', () => {
    it('queue remains the same if any staff are checked in', async () => {
      const ta = await UserFactory.create();
      const queue = await QueueFactory.create({ staffList: [ta] });
      await QuestionFactory.create({
        status: OpenQuestionStatus.Queued,
        queue: queue,
      });

      await service.cleanQueue(queue.id);

      const question = await QuestionModel.findOne({});
      expect(question.status).toEqual('Queued');
    });

    it('queue gets cleaned when force parameter is passed, even with staff present', async () => {
      const ta = await UserFactory.create();
      const queue = await QueueFactory.create({ staffList: [ta] });
      const question = await QuestionFactory.create({
        status: OpenQuestionStatus.Queued,
        queue: queue,
      });

      await service.cleanQueue(queue.id, true);

      await question.reload();
      expect(question.status).toEqual('Stale');
    });

    it('if no staff are present all questions with open status are marked as stale', async () => {
      const ofs = await ClosedOfficeHourFactory.create();
      const queue = await QueueFactory.create({ officeHours: [ofs] });
      const question = await QuestionFactory.create({
        status: OpenQuestionStatus.Queued,
        queue: queue,
      });

      await service.cleanQueue(queue.id);
      await question.reload();
      expect(question.status).toEqual('Stale');
    });

    it('if no staff are present all questions with limbo status are marked as stale', async () => {
      const ofs = await ClosedOfficeHourFactory.create();
      const queue = await QueueFactory.create({ officeHours: [ofs] });
      const question = await QuestionFactory.create({
        status: LimboQuestionStatus.TADeleted,
        queue: queue,
      });

      await service.cleanQueue(queue.id);
      await question.reload();
      expect(question.status).toEqual('Stale');
    });

    it('cleaning the queue removes the queue notes', async () => {
      const ofs = await ClosedOfficeHourFactory.create();
      const queue = await QueueFactory.create({
        officeHours: [ofs],
        notes: 'This note is no longer relevant',
      });

      await service.cleanQueue(queue.id);
      await queue.reload();
      expect(queue.notes).toBe('');
    });
  });
});
