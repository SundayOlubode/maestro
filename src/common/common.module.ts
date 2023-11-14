import { Module } from '@nestjs/common';
import { CommonService } from './common.service';

@Module({
  controllers: [],
  providers: [CommonService],
})
export class CommonModule {}
