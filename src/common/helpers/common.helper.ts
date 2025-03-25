import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {DataSource, ObjectLiteral, SelectQueryBuilder} from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEntityExistConstraint implements ValidatorConstraintInterface {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {
        console.log(dataSource);
    }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        if (!value) return false;

        const [entityClass] = args.constraints; // Get entity class from decorator
        const repository = this.dataSource.getRepository(entityClass);

        // Find the entity by its ID
        const entity = await repository.findOne({ where: { id: value } });
        return !!entity; // Return true if entity exists
    }

    defaultMessage(args: ValidationArguments): string {
        const [entityClass] = args.constraints;
        return `${entityClass.name} with ID '${args.value}' does not exist.`;
    }
}

export function IsEntityExist(
    entityClass: Function,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [entityClass],
            validator: IsEntityExistConstraint,
        });
    };
}



export async function paginate<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    page: number,
    limit: number,
    isDynamicColumn=false
): Promise<{
    data: T[];
    total: number;
    currentPage: number;
    totalPages: number;
}> {
    const offset = (page - 1) * limit;

    // Apply pagination
    query.skip(offset).take(limit);

    // Execute query and get results
    if (isDynamicColumn) {
        const data = await query.getMany();
        const total = await query.getCount();

        return {
            data,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    } else {
        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }

}

export async function paginateForProducts<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  page: number,
  limit: number,
): Promise<{
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}> {
  const offset = (page - 1) * limit;

  // Apply pagination
  query.skip(offset).take(limit);

  // Execute query and fetch both raw and entity data
  const [entities, total] = await query.getManyAndCount();
  const rawData = await query.getRawMany(); // Fetch raw data in the same query

  // Merge `isWishList` from raw data into the entities
  const formattedData = entities.map((product) => {
    const rawProduct = rawData.find((p) => p.product_id === (product as any).id);
    return {
      ...product,
      isWishList: rawProduct ? Number(rawProduct.isWishList) === 1 : false,
    };
  });

  return {
    data: formattedData,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function paginateDynamicField<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    page: number,
    limit: number,
    fields: Record<string, FieldType>
): Promise<{
    data: T[];
    total: number;
    currentPage: number;
    totalPages: number;
}> {
    const offset = (page - 1) * limit;

    // Apply pagination
    query.skip(offset).take(limit);

    // Execute query and fetch both raw and entity data
    const [entities, total] = await query.getManyAndCount();
    const rawData = await query.getRawMany(); // Fetch raw data in the same query

    // Merge `isWishList` from raw data into the entities
    const formattedData = getData(entities,rawData,fields)



    return {
        data: formattedData,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
    };
}

type FieldType = 'number' | 'string' | 'boolean';

const getData = (entities: any[], rawData: any[], fields: Record<string, FieldType>) => {
    return entities.map((entity,index) => {
        // Find corresponding raw data entry (assuming `id` is the common key)
        const rawEntry = rawData[index];
        if (rawEntry) {
            // Merge specified fields with correct data type
            Object.entries(fields).forEach(([field, type]) => {
                if (rawEntry[field] !== undefined) {
                    switch (type) {
                        case 'number':
                            entity[field] = isNaN(Number(rawEntry[field])) ? 0 : Number(rawEntry[field]);
                            break;
                        case 'boolean':
                            entity[field] = rawEntry[field] === 'true' || rawEntry[field] === true;
                            break;
                        case 'string':
                        default:
                            entity[field] = String(rawEntry[field]);
                    }
                }
            });
        }

        return entity;
    });
};
