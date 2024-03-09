import { GetAddressesQueryDto } from './dto/get-addresses-query.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressService } from './address.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ParamIdDto } from 'src/common/dto/param-id.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/')
  async getAll(@Query() queryParams: GetAddressesQueryDto) {
    let { page, pageSize } = queryParams;

    page = page || 1;
    pageSize = pageSize || 10;

    return this.addressService.getAll(page, pageSize);
  }

  @Get('/:id')
  async getOne(@Param() param: ParamIdDto) {
    return this.addressService.getOne(param.id);
  }

  @Post('/')
  async create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Patch('/:id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(param.id, updateAddressDto);
  }

  @Delete('/:id')
  async delete(@Param() param: ParamIdDto) {
    return this.addressService.delete(param.id);
  }
}
