import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import {TeachersModule} from "./teachers/teachers.module";
import {StudentsModule} from "./students/students.module";
import {SubjectsModule} from "./subjects/subjects.module";
import {AttendanceModule} from "./attendance/attendance.module";
import {ClassScheduleModule} from "./class-schedule/class-schedule.module";
import {BatchesModule} from "./batches/batches.module";
import {CoursesModule} from "./courses/courses.module";
import {EnrollmentModule} from "./enrollment/enrollment.module";
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: 'root',
      password: 'Iyartitl1',
      database: 'e_attendance',
      entities: [],
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
      timezone: 'Z',// disable in production
    }),
    UsersModule,
    AuthModule,
    TeachersModule,
    StudentsModule,
    SubjectsModule,
    AttendanceModule,
    ClassScheduleModule,
    BatchesModule,
    CoursesModule,
    EnrollmentModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
