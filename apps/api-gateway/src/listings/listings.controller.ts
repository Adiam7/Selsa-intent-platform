import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Headers,
  Param,
  Query,
  Version,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  ListingsService,
  CreateListingDto,
  UpdateListingDto,
} from './listings.service';

@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'List all listings' })
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
      limit: limit,
      offset: offset,
    });
  }

  @Get(':id')
  @Version('1')
  @ApiOperation({ summary: 'Get a listing by ID' })
  async findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a new listing' })
  async create(
    @Body() body: CreateListingDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.listingsService.create(userId, body);
  }

  @Put(':id')
  @Version('1')
  @ApiOperation({ summary: 'Update a listing' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateListingDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.listingsService.update(id, userId, body);
  }

  @Delete(':id')
  @Version('1')
  @ApiOperation({ summary: 'Delete a listing' })
  async delete(
    @Param('id') id: string,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.listingsService.delete(id, userId);
  }
}
