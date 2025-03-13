import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreService } from './store.service';
import { StoreResolver } from './store.resolver';
import { Store, StoreSchema } from './entities/store.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
  ],
  providers: [StoreService, StoreResolver],
  exports: [StoreService],
})
export class StoreModule {}
