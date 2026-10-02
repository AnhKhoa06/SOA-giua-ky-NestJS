import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DangKyService } from './dang-ky.service';
import { CreateDangKyDto } from './dto/create-dang-ky.dto';
import { UpdateDangKyDto } from './dto/update-dang-ky.dto';

@Controller('dang-ky')
export class DangKyController {
  constructor(private readonly service: DangKyService) {}

  @Post()
  create(@Body() dto: CreateDangKyDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDangKyDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
