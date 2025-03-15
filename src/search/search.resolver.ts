import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { CreateSearchInput } from './dto/search.input';
import { UpdateSearchInput } from './dto/search-filter.input';

@Resolver('Search')
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Mutation('createSearch')
  create(@Args('createSearchInput') createSearchInput: CreateSearchInput) {
    return this.searchService.create(createSearchInput);
  }

  @Query('search')
  findAll() {
    return this.searchService.findAll();
  }

  @Query('search')
  findOne(@Args('id') id: number) {
    return this.searchService.findOne(id);
  }

  @Mutation('updateSearch')
  update(@Args('updateSearchInput') updateSearchInput: UpdateSearchInput) {
    return this.searchService.update(updateSearchInput.id, updateSearchInput);
  }

  @Mutation('removeSearch')
  remove(@Args('id') id: number) {
    return this.searchService.remove(id);
  }
}
