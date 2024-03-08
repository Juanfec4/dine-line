import { CreateMenuItemDto } from './create-menu-item.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}
