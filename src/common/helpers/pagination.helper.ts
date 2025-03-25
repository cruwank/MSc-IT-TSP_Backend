import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export interface PaginationOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  searchFields?: string[]; // Fields to search in
}

export async function applyPaginationAndSorting<T extends ObjectLiteral>(
    query: SelectQueryBuilder<T>,
    options: PaginationOptions,
): Promise<{ data: T[]; total: number; page: number; lastPage: number }> {
  const { page, limit, search, sortBy, order, searchFields } = options;

  // Add search filter
  if (search && searchFields && searchFields.length > 0) {
    const searchConditions = searchFields.map(
        (field) => `${query.alias}.${field} LIKE :search`,
    );
    query.andWhere(`(${searchConditions.join(' OR ')})`, { search: `%${search}%` });
  }

  // Add sorting
  if (sortBy) {
    query.orderBy(`${query.alias}.${sortBy}`, order || 'ASC');
  }

  // Pagination
  const skip = (page - 1) * limit;
  query.skip(skip).take(limit);

  const [data, total] = await query.getManyAndCount();

  return {
    data,
    total,
    page,
    lastPage: Math.ceil(total / limit),
  };
}
