import { Resolver, Query, Args } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { SearchInput, SearchResultOutput } from './dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, JwtAuthGuard, RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';
import { User, UserRole } from '../user/entities/user-entity';

@Resolver(() => SearchResultOutput)
@UseGuards(GqlAuthGuard, JwtAuthGuard, RolesGuard)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => SearchResultOutput, { name: 'search' })
  @Roles(UserRole.USER, UserRole.ADMIN)
  async search(
    @Args('input') input: SearchInput,
    @CurrentUser() currentUser: User,
  ): Promise<SearchResultOutput> {
    return this.searchService.search(input);
  }
}
