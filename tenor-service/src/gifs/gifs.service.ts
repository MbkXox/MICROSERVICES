import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import axios from 'axios';

/**
 * Service métier pour la gestion des GIFs et favoris.
 */
@Injectable()
export class GifsService {
  constructor(private prisma: PrismaService) {}

  async searchGifs(query: string): Promise<any> {
    const apiKey = process.env.TENOR_API_KEY;
    const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${apiKey}&limit=20`;
    const response = await axios.get(url);
    return response.data.results.map(gif => ({
      id: gif.id,
      url: gif.media_formats.gif.url,
      title: gif.title,
    }));
  }

  async createFavorite(userId: string, dto: CreateFavoriteDto) {
    return this.prisma.favorite.create({
      data: {
        userId,
        gifId: dto.gifId,
      },
    });
  }

  async findAllFavorites(userId: string): Promise<any[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (favorites.length === 0) {
      return [];
    }

    const gifIds = favorites.map(fav => fav.gifId);
    const apiKey = process.env.TENOR_API_KEY;
    const url = `https://tenor.googleapis.com/v2/posts?ids=${gifIds.join(',')}&key=${apiKey}`;
    const response = await axios.get(url);

    const gifsMap = new Map(response.data.results.map((gif: any) => [gif.id, {
      id: gif.id,
      url: gif.media_formats.gif.url,
      title: gif.title,
    }]));

    return favorites.map(fav => ({
      id: fav.id,
      gifId: fav.gifId,
      createdAt: fav.createdAt,
      gif: gifsMap.get(fav.gifId) || null,
    }));
  }

  async removeFavorite(id: number, userId: string): Promise<void> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { id, userId },
    });
    if (!favorite) {
      throw new NotFoundException('Favori non trouvé');
    }
    await this.prisma.favorite.delete({
      where: { id },
    });
  }
}