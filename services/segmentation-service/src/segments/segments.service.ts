import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SegmentEntity } from './entities/segment.entity';
import { CreateSegmentInput } from '@intent/event-schemas';

@Injectable()
export class SegmentsService {
  private readonly logger = new Logger(SegmentsService.name);

  constructor(
    @InjectRepository(SegmentEntity)
    private readonly segmentRepo: Repository<SegmentEntity>,
  ) {}

  async create(dto: CreateSegmentInput): Promise<SegmentEntity> {
    const segment = this.segmentRepo.create({
      name: dto.name,
      description: dto.description,
      rulesJson: dto.rules as object[],
      operator: dto.operator,
    });
    return this.segmentRepo.save(segment);
  }

  async findAll(): Promise<SegmentEntity[]> {
    return this.segmentRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<SegmentEntity> {
    const segment = await this.segmentRepo.findOne({ where: { id } });
    if (!segment) throw new NotFoundException(`Segment ${id} not found`);
    return segment;
  }

  async delete(id: string): Promise<void> {
    await this.segmentRepo.delete(id);
  }

  async getUsersInSegment(segmentId: string): Promise<{ userId: string }[]> {
    return [] as { userId: string }[]; // TODO: query user_segments table
  }
}
