import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProcessorModule } from './processors/processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProcessorModule,
  ],
})
export class AppModule {}
