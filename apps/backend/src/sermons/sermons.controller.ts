import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SermonsService } from './sermons.service';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { UpdateSermonDto } from './dto/update-sermon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sermons')
export class SermonsController {
  constructor(private readonly sermonsService: SermonsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createSermonDto: CreateSermonDto,
    @UploadedFiles()
    files: {
      audio?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    if (!files.audio || files.audio.length === 0) {
      throw new Error('Audio file is required');
    }

    return this.sermonsService.create(
      createSermonDto,
      files.audio[0],
      files.image?.[0],
    );
  }

  @Get()
  findAll() {
    return this.sermonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sermonsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSermonDto: UpdateSermonDto,
    @UploadedFiles()
    files: {
      audio?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ) {
    return this.sermonsService.update(
      id,
      updateSermonDto,
      files.audio?.[0],
      files.image?.[0],
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sermonsService.remove(id);
  }

  @Post(':id/play')
  incrementPlayCount(@Param('id', ParseIntPipe) id: number) {
    return this.sermonsService.incrementPlayCount(id);
  }

  @Post(':id/download')
  incrementDownloadCount(@Param('id', ParseIntPipe) id: number) {
    return this.sermonsService.incrementDownloadCount(id);
  }
}
