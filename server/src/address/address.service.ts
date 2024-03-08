import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entity/address.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/iam/services/user/entity/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class AddressService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    //Get user
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    //Check if alias is already taken by user
    const existingAddressWithAlias = await this.getByAlias(
      createAddressDto.alias,
    );

    if (existingAddressWithAlias) {
      throw new BadRequestException(
        `An address with the alias ${createAddressDto.alias} already exists`,
      );
    }

    //Check if new address is primary
    if (createAddressDto.isPrimary) {
      //Get current primary address and set it to false if it exists
      const primaryAddress = await this.getPrimary(userId);

      if (primaryAddress) {
        await this.addressRepository.save({
          ...primaryAddress,
          isPrimary: false,
        });
      }
    }

    //Create address object
    const newAddress = await this.addressRepository.create({
      ...createAddressDto,
      user: dummyUser,
    });

    //Save new address
    await this.addressRepository.save(newAddress);
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    //Get user
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    //Invalid id
    const existingAddress = await this.addressRepository.findOne({
      where: { id, user: dummyUser },
    });

    if (!existingAddress) {
      throw new NotFoundException(`Address with id ${id} not found.`);
    }

    if (updateAddressDto.alias) {
      //Check if alias is already taken by user
      const existingAddressWithAlias = await this.getByAlias(
        updateAddressDto.alias,
      );

      if (existingAddressWithAlias) {
        throw new BadRequestException(
          `An address with the alias ${updateAddressDto.alias} already exists`,
        );
      }
    }

    //Check if updated address is primary
    if (updateAddressDto.isPrimary) {
      //Get current primary address and set it to false if it exists
      const primaryAddress = await this.getPrimary(userId);

      if (primaryAddress) {
        await this.addressRepository.save({
          ...primaryAddress,
          isPrimary: false,
        });
      }
    }

    //Update object
    const updatedAddress = await this.addressRepository.preload({
      id,
      ...updateAddressDto,
    });

    //Save updated address
    await this.addressRepository.save(updatedAddress);
  }

  async delete(id: number) {
    const existingAddress = await this.getOne(id);

    //Delete address
    await this.addressRepository.delete(existingAddress);
  }

  async getAll(page: number, pageSize: number) {
    //Get user
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    const addresses = await this.addressRepository.find({
      where: { user: dummyUser },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return addresses;
  }

  async getOne(id: number) {
    //Get user
    const userId = this.request['userId'];
    const dummyUser: Partial<User> = { id: userId };

    //Find address
    const address = await this.addressRepository.findOne({
      where: { id, user: dummyUser },
    });

    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found.`);
    }

    return address;
  }

  async getPrimary(userId: number) {
    const primaryAddress = await this.addressRepository.findOne({
      where: { user: { id: userId }, isPrimary: true },
    });
    return primaryAddress;
  }

  async getByAlias(alias: string) {
    const address = await this.addressRepository.findOne({ where: { alias } });

    return address;
  }
}
