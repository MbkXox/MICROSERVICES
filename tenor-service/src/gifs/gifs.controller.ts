import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GifsService } from './gifs.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

/**
 * Contrôleur REST pour les GIFs et favoris.
 * Toutes les routes nécessitent un JWT valide.
 */
@Controller('gifs')
@UseGuards(JwtAuthGuard)
@ApiTags('gifs')
@ApiBearerAuth()
export class GifsController {
  constructor(private readonly gifsService: GifsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des GIFs via Tenor' })
  @ApiQuery({ name: 'q', description: 'Query de recherche' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche' })
  async search(@Query('q') query: string) {
    return this.gifsService.searchGifs(query);
  }

  @Post('favorites')
  @ApiOperation({ summary: 'Ajouter un GIF aux favoris' })
  @ApiResponse({ status: 201, description: 'Favori ajouté' })
  createFavorite(@User() user: any, @Body() dto: CreateFavoriteDto) {
    return this.gifsService.createFavorite(user.sub, dto);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Récupérer les favoris de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des favoris' })
  findAllFavorites(@User() user: any) {
    return this.gifsService.findAllFavorites(user.sub);
  }

  @Delete('favorites/:id')
  @ApiOperation({ summary: 'Supprimer un favori' })
  @ApiResponse({ status: 200, description: 'Favori supprimé' })
  removeFavorite(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    return this.gifsService.removeFavorite(id, user.sub);
  }
}