import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeTai } from './de-tai.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeTaiService {
    constructor(
        @InjectRepository(DeTai) 
        private readonly deTaiRepository: Repository<DeTai>,
        
    ) {}

    //Add a new DeTai
    async createDeTai(deTai: DeTai): Promise<DeTai> {
        const newDeTai = this.deTaiRepository.create(deTai);
        return await this.deTaiRepository.save(newDeTai);
    }

    //Get all DeTai
    async getAllDeTai(): Promise<DeTai[]> {
        return await this.deTaiRepository.find();
    }

    //Get DeTai by id
    async findOne(id: number): Promise<DeTai> {
        const deTai = await this.deTaiRepository.findOneBy({ maDeTai: id });
        if (!deTai) {
          throw new NotFoundException(`Không tìm thấy đề tài với ID: ${id}`);
        }
        return deTai;
    }

    //Update DeTai by id
    async update(id: number, data: Partial<DeTai>): Promise<DeTai> {
        const deTai = await this.findOne(id);
        Object.assign(deTai, data);
        return await this.deTaiRepository.save(deTai);
    }

    //Delete DeTai by id
    async remove(id: number): Promise<{ message: string }> {
        const deTai = await this.findOne(id);
        await this.deTaiRepository.remove(deTai);
        return { message: `Đã xóa thành công đề tài có ID: ${id}` };
    }
}
