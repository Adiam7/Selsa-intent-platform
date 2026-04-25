import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IntentController } from './intent.controller';
import { IntentService } from './intent.service';

@Module({
  imports: [HttpModule],
  controllers: [IntentController],
  providers: [IntentService],
})
export class IntentModule {}
