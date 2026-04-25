import { Controller, Get, Post, Body, Param, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SegmentsService } from './segments.service';

@ApiTags('segments')
@ApiBearerAuth()
@Controller('segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'List all segments' })
  async list() {
    return this.segmentsService.list();
  }

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create a new segment' })
  async create(@Body() body: Record<string, unknown>) {
    return this.segmentsService.create(body);
  }

  @Get(':id/users')
  @Version('1')
  @ApiOperation({ summary: 'Get users in a segment' })
  async getUsers(@Param('id') id: string) {
    return this.segmentsService.getUsers(id);
  }
}
