import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ImageService } from './../image/image.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from './entity/menu-item.entity';
import { Repository } from 'typeorm';
import { ItemCategory } from './entity/item-category.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(ItemCategory)
    private readonly itemCategoryRepository: Repository<ItemCategory>,
    private readonly imageService: ImageService,
  ) {}

  async create(baseUrl: string, createMenuItemDto: CreateMenuItemDto) {
    //Check if image file exists
    const isValidFile = await this.imageService.isValidFile(
      createMenuItemDto.imageFilePath,
    );

    if (!isValidFile) {
      throw new BadRequestException('Invalid file path.');
    }
    //Create url
    const imageUrl = `${baseUrl}/${createMenuItemDto.imageFilePath}`;
    const category = await this.createCategory(createMenuItemDto.category);

    const menuItem = await this.menuItemRepository.create({
      ...createMenuItemDto,
      imageUrl,
      category,
    });

    await this.menuItemRepository.save(menuItem);
  }

  async update(
    id: number,
    baseUrl: string,
    updateMenuItemDto: UpdateMenuItemDto,
  ) {
    let imageUrl: string | null = null;
    let category: ItemCategory | null = null;

    //Check if image file exists
    if (updateMenuItemDto.imageFilePath) {
      const isValidFile = await this.imageService.isValidFile(
        updateMenuItemDto.imageFilePath,
      );

      if (!isValidFile) {
        throw new BadRequestException('Invalid file path.');
      }
      //Create url
      imageUrl = `${baseUrl}/${updateMenuItemDto.imageFilePath}`;
    }

    if (updateMenuItemDto.category) {
      category = await this.createCategory(updateMenuItemDto.category);
    }
    // Constructing the object to preload
    const updateObject: any = { id: id, ...updateMenuItemDto };

    if (imageUrl) {
      updateObject.imageUrl = imageUrl;
    }

    if (category) {
      updateObject.category = category;
    }

    const updatedMenuItem = await this.menuItemRepository.preload(updateObject);

    if (!updatedMenuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found.`);
    }
    //Save the updated menu item
    await this.menuItemRepository.save(updatedMenuItem);
  }

  async getAll(page: number, pageSize: number, categoryId?: number) {
    if (categoryId) {
      const dummyCategory: Partial<ItemCategory> = { id: categoryId };

      return await this.menuItemRepository.find({
        where: { category: dummyCategory },
        relations: { category: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
    }
    return await this.menuItemRepository.find({
      relations: { category: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getCategories() {
    return await this.itemCategoryRepository.find();
  }

  async delete(id: number) {
    //Get menu item
    const menuItem = await this.getOne(id);

    //Get category id
    const categoryId = menuItem.category.id;

    //Delete menu item image
    const segments = menuItem.imageUrl.split('/');
    const fileName = segments[segments.length - 1];

    //Delete menu item image
    try {
      await this.imageService.deleteFile(fileName);
    } catch (error: any) {}

    //Delete menu item
    await this.menuItemRepository.delete(id);

    //Check if menu item category is not used by any menu item
    const menuItemCategory = await this.itemCategoryRepository.findOne({
      where: { id: categoryId },
      relations: { menuItems: true },
    });

    //Delete unused menu item category
    if (
      !menuItemCategory.menuItems ||
      menuItemCategory.menuItems.length === 0
    ) {
      await this.itemCategoryRepository.delete(categoryId);
    }
  }

  async getOne(id: number) {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} does not exist.`);
    }
    return menuItem;
  }

  private async createCategory(name: string) {
    const existingCategory = await this.itemCategoryRepository.findOne({
      where: { name },
    });

    //Return existing
    if (existingCategory) {
      return existingCategory;
    }

    //Create if it does not exist
    const newCategory = await this.itemCategoryRepository.create({ name });
    return await this.itemCategoryRepository.save(newCategory);
  }
}
