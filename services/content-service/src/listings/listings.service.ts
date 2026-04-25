import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingEntity } from './entities/listing.entity';

export interface CreateListingDto {
  user_id: string;
  intent_type: string;
  category: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface UpdateListingDto {
  category?: string;
  title?: string;
  description?: string;
  metadata?: Record<string, any>;
  status?: 'active' | 'completed' | 'archived';
}

@Injectable()
export class ListingsService {
  private readonly logger = new Logger(ListingsService.name);

  constructor(
    @InjectRepository(ListingEntity)
    private readonly listingRepo: Repository<ListingEntity>,
  ) {}

  async create(dto: CreateListingDto): Promise<ListingEntity> {
    const listing = this.listingRepo.create({
      user_id: dto.user_id,
      intent_type: dto.intent_type,
      category: dto.category,
      title: dto.title,
      description: dto.description,
      metadata: dto.metadata || {},
      status: 'active',
    });
    return this.listingRepo.save(listing);
  }

  async findAll(params: {
    intent_type?: string;
    category?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ListingEntity[]> {
    const query = this.listingRepo.createQueryBuilder('listing');

    if (params.intent_type) {
      query.andWhere('listing.intent_type = :intent_type', {
        intent_type: params.intent_type,
      });
    }

    if (params.category) {
      query.andWhere('listing.category = :category', {
        category: params.category,
      });
    }

    if (params.status) {
      query.andWhere('listing.status = :status', {
        status: params.status,
      });
    } else {
      query.andWhere('listing.status = :status', { status: 'active' });
    }

    query.orderBy('listing.created_at', 'DESC');

    const limit = Math.min(params.limit || 20, 100);
    const offset = params.offset || 0;

    return query.take(limit).skip(offset).getMany();
  }

  async findOne(id: string): Promise<ListingEntity> {
    const listing = await this.listingRepo.findOne({ where: { id } });
    if (!listing) {
      throw new NotFoundException(`Listing ${id} not found`);
    }
    return listing;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateListingDto,
  ): Promise<ListingEntity> {
    const listing = await this.findOne(id);

    // Check ownership
    if (listing.user_id !== userId) {
      throw new ForbiddenException('Cannot update listing you do not own');
    }

    if (dto.category) listing.category = dto.category;
    if (dto.title) listing.title = dto.title;
    if (dto.description) listing.description = dto.description;
    if (dto.metadata) listing.metadata = dto.metadata;
    if (dto.status) listing.status = dto.status;

    return this.listingRepo.save(listing);
  }

  async delete(id: string, userId: string): Promise<void> {
    const listing = await this.findOne(id);

    // Check ownership
    if (listing.user_id !== userId) {
      throw new ForbiddenException('Cannot delete listing you do not own');
    }

    await this.listingRepo.delete(id);
  }
}
