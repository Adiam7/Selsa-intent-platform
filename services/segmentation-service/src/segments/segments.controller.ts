import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { SegmentsService } from './segments.service';
import { CreateSegmentInput } from '@intent/event-schemas';
import { ZodValidationPipe } from '@intent/validation';
import { CreateSegmentSchema } from '@intent/event-schemas';
import { UsePipes } from '@nestjs/common';

@Controller('segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateSegmentSchema))
  create(@Body() dto: CreateSegmentInput) {
    return this.segmentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.segmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.segmentsService.findOne(id);
  }

  @Get(':id/users')
  getUsers(@Param('id') id: string) {
    return this.segmentsService.getUsersInSegment(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.segmentsService.delete(id);
  }
}
