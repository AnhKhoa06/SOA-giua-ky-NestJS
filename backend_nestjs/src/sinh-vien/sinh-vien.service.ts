import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SinhVien } from './sinh-vien.entity';
import { CreateSinhVienDto } from './dto/create-sinh-vien.dto';
import { UpdateSinhVienDto } from './dto/update-sinh-vien.dto';

@Injectable()
export class SinhVienService {
  constructor(
    @InjectRepository(SinhVien)
    private readonly sinhVienRepository: Repository<SinhVien>,
  ) {}

  // CREATE - Thêm sinh viên mới
  async create(data: CreateSinhVienDto): Promise<SinhVien> {
    // Kiểm tra xem MaSV đã tồn tại chưa
    const existingStudent = await this.sinhVienRepository.findOne({
      where: { MaSV: data.MaSV },
    });

    if (existingStudent) {
      throw new ConflictException('Mã sinh viên đã tồn tại');
    }

    const sinhVien = this.sinhVienRepository.create(data);
    return await this.sinhVienRepository.save(sinhVien);
  }

  // READ ALL - Lấy tất cả sinh viên
  async findAll(): Promise<SinhVien[]> {
    return await this.sinhVienRepository.find();
  }

  // READ ONE - Lấy 1 sinh viên theo MaSV
  async findOne(MaSV: string): Promise<SinhVien> {
    const sinhVien = await this.sinhVienRepository.findOne({
      where: { MaSV },
    });

    if (!sinhVien) {
      throw new NotFoundException(`Không tìm thấy sinh viên có mã ${MaSV}`);
    }

    return sinhVien;
  }

  // UPDATE - Cập nhật thông tin sinh viên
  async update(MaSV: string, data: UpdateSinhVienDto): Promise<SinhVien> {
    const sinhVien = await this.findOne(MaSV);
    Object.assign(sinhVien, data);
    return await this.sinhVienRepository.save(sinhVien);
  }

  // DELETE - Xóa sinh viên
  async remove(MaSV: string): Promise<{ message: string }> {
    const sinhVien = await this.findOne(MaSV);
    await this.sinhVienRepository.remove(sinhVien);
    return {
      message: `Đã xóa sinh viên ${MaSV} thành công`,
    };
  }
}
