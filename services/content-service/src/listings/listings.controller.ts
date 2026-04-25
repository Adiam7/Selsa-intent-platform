import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  BadRequestException,
  Param,
  Query,
} from '@nestjs/common';
import { ListingsService, CreateListingDto, UpdateListingDto } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async findAll(
    @Query('intent_type') intentType?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.listingsService.findAll({
      intent_type: intentType,
      category: category,
      status: status,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateListingDto) {
    if (!body.user_id) {
      throw new BadRequestException('user_id is required');
    }
    return this.listingsService.create({
      ...body,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateListingDto & { user_id?: string }) {
    if (!dto.user_id) {
      throw new BadRequestException('user_id is required');
    }
    const { user_id: userId } = dto;
    return this.listingsService.update(id, userId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Body() body: { user_id?: string }) {
    if (!body.user_id) {
      throw new BadRequestException('user_id is required');
    }
    const userId = body.user_id;
    await this.listingsService.delete(id, userId);
    return { success: true };
  }
}
