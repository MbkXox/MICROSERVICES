import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Contrôleur REST pour les commandes utilisateur.
 * Toutes les routes nécessitent un JWT valide.
 */
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiTags('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle commande' })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès' })
  create(@User() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les commandes de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des commandes' })
  findAll(@User() user: any) {
    return this.ordersService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une commande par ID' })
  @ApiResponse({ status: 200, description: 'Détails de la commande' })
  findOne(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    return this.ordersService.findOne(id, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une commande' })
  @ApiResponse({ status: 200, description: 'Commande supprimée' })
  remove(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    return this.ordersService.remove(id, user.sub);
  }
}
