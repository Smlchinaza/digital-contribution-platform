import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary.service';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { UpdateSermonDto } from './dto/update-sermon.dto';

@Injectable()
export class SermonsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    createSermonDto: CreateSermonDto,
    audioFile: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ) {
    // Upload audio to Cloudinary
    const audioUpload = await this.cloudinary.uploadAudio(audioFile);

    // Upload image if provided
    let imageUpload = null;
    if (imageFile) {
      imageUpload = await this.cloudinary.uploadImage(imageFile);
    }

    // Create sermon in database
    return this.prisma.sermon.create({
      data: {
        title: createSermonDto.title,
        preacher: createSermonDto.preacher,
        description: createSermonDto.description,
        date: new Date(createSermonDto.date),
        duration: createSermonDto.duration,
        audioUrl: audioUpload.url,
        audioPublicId: audioUpload.publicId,
        imageUrl: imageUpload?.url,
        imagePublicId: imageUpload?.publicId,
      },
    });
  }

  async findAll() {
    return this.prisma.sermon.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const sermon = await this.prisma.sermon.findUnique({
      where: { id },
    });

    if (!sermon) {
      throw new NotFoundException(`Sermon with ID ${id} not found`);
    }

    return sermon;
  }

  async update(
    id: number,
    updateSermonDto: UpdateSermonDto,
    audioFile?: Express.Multer.File,
    imageFile?: Express.Multer.File,
  ) {
    const sermon = await this.findOne(id);

    const updateData: any = {
      ...updateSermonDto,
      date: updateSermonDto.date ? new Date(updateSermonDto.date) : undefined,
    };

    // Update audio if new file provided
    if (audioFile) {
      // Delete old audio
      await this.cloudinary.deleteFile(sermon.audioPublicId, 'video');
      // Upload new audio
      const audioUpload = await this.cloudinary.uploadAudio(audioFile);
      updateData.audioUrl = audioUpload.url;
      updateData.audioPublicId = audioUpload.publicId;
    }

    // Update image if new file provided
    if (imageFile) {
      // Delete old image if exists
      if (sermon.imagePublicId) {
        await this.cloudinary.deleteFile(sermon.imagePublicId, 'image');
      }
      // Upload new image
      const imageUpload = await this.cloudinary.uploadImage(imageFile);
      updateData.imageUrl = imageUpload.url;
      updateData.imagePublicId = imageUpload.publicId;
    }

    return this.prisma.sermon.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    const sermon = await this.findOne(id);

    // Delete files from Cloudinary
    await this.cloudinary.deleteFile(sermon.audioPublicId, 'video');
    if (sermon.imagePublicId) {
      await this.cloudinary.deleteFile(sermon.imagePublicId, 'image');
    }

    // Delete from database
    return this.prisma.sermon.delete({
      where: { id },
    });
  }

  async incrementPlayCount(id: number) {
    return this.prisma.sermon.update({
      where: { id },
      data: { playCount: { increment: 1 } },
    });
  }

  async incrementDownloadCount(id: number) {
    return this.prisma.sermon.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
  }
}
