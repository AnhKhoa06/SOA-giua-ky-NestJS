import { Module } from '@nestjs/common';
import { SinhVienController } from './sinh-vien.controller';
import { SinhVienService } from './sinh-vien.service';

@Module({
  controllers: [SinhVienController],
  providers: [SinhVienService]
})
export class SinhVienModule {}
