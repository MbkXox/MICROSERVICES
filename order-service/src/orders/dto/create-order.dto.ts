import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Schéma d'entrée pour créer une commande.
 */
export class CreateOrderDto {
  @ApiProperty({
    description: 'Le nom de l\'article commandé',
    example: 'Ordinateur portable',
  })
  @IsString()
  @IsNotEmpty()
  item: string;
}
