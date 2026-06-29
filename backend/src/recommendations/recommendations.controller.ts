import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products (no auth required)' })
  @ApiQuery({ name: 'limit', required: false })
  getFeatured(@Query('limit') limit?: string) {
    return this.recommendationsService.getFeatured(limit ? parseInt(limit) : 8);
  }

  @Get('for-me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalised recommendations for logged-in user' })
  @ApiQuery({ name: 'limit', required: false })
  getForMe(@CurrentUser() user: UserDocument, @Query('limit') limit?: string) {
    return this.recommendationsService.getForUser(
      (user._id as unknown as { toString(): string }).toString(),
      limit ? parseInt(limit) : 8,
    );
  }
}
