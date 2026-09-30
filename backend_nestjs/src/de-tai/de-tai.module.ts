import { Module } from '@nestjs/common';
import { DeTaiController } from './de-tai.controller';
import { DeTaiService } from './de-tai.service';

@Module({
  controllers: [DeTaiController],
  providers: [DeTaiService]
})
export class DeTaiModule {}
