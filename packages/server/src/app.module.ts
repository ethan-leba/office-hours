import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CourseModule } from './course/course.module';
import { NotificationModule } from './notification/notification.module';
import { LoginModule } from './login/login.module';
import { ProfileModule } from './profile/profile.module';
import { QuestionModule } from './question/question.module';
import { QueueModule } from './queue/queue.module';
import { SeedModule } from './seed/seed.module';
import { AdminModule } from './admin/admin.module';
import { CommandModule } from 'nestjs-command';
import { SSEModule } from './sse/sse.module';
import * as typeormConfig from '../ormconfig';
import { BackfillModule } from 'backfill/backfill.module';
import { ReleaseNotesModule } from 'release-notes/release-notes.module';
import { RedisModule } from 'nestjs-redis';
import { HealthcheckModule } from './healthcheck/healthcheck.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    ScheduleModule.forRoot(),
    LoginModule,
    ProfileModule,
    CourseModule,
    QueueModule,
    NotificationModule,
    QuestionModule,
    SeedModule,
    ConfigModule.forRoot({
      envFilePath: [
        '.env',
        ...(process.env.NODE_ENV !== 'production' ? ['.env.development'] : []),
      ],
      isGlobal: true,
    }),
    AdminModule,
    CommandModule,
    SSEModule,
    BackfillModule,
    ReleaseNotesModule,
    // Only use 'pub' for publishing events, 'sub' for subscribing, and 'db' for writing to key/value store
    RedisModule.register([{ name: 'pub' }, { name: 'sub' }, { name: 'db' }]),
    HealthcheckModule,
  ],
})
export class AppModule {}
