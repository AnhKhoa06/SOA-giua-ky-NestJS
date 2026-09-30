import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SinhVienModule } from './sinh-vien/sinh-vien.module';
import { DeTaiModule } from './de-tai/de-tai.module';
import { DangKyModule } from './dang-ky/dang-ky.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'quanly_dotot_nghiep',
      autoLoadEntities: true,
      synchronize: false,
    }),
    SinhVienModule,
    DeTaiModule,
    DangKyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
