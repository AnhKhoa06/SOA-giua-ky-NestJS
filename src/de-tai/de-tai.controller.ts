import {Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe,} from '@nestjs/common';
import { DeTaiService } from './de-tai.service';
import { DeTai } from './de-tai.entity';

@Controller('de-tai')
export class DeTaiController {
    constructor(private readonly deTaiService: DeTaiService) { }

    //POST /de-tai
    @Post()
    createDeTai(@Body() body: Partial<DeTai>) {
        return this.deTaiService.createDeTai(body as DeTai);
    }

    //GET /de-tai
    @Get()
    getAllDeTai() {
        return this.deTaiService.getAllDeTai();
    }

    //GET /de-tai/:id
    @Get(':id')
    getDeTaiById(@Param('id', ParseIntPipe) id: number) {
        return this.deTaiService.findOne(id);
    }

    //PUT /de-tai/:id
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Partial<DeTai>,
    ) {
        return this.deTaiService.update(id, body);
    }

    //DELETE /de-tai/:id
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.deTaiService.remove(id);
    }
}
