import { supabase } from "../config/database";
import { Database } from "../types/database";
import { logger } from "../utils/logger";

// Generic database service class
export class DatabaseService {
  // Generic create method
  static async create<T extends keyof Database['public']['Tables']>(
    table: T,
    data: Database['public']['Tables'][T]['Insert']
  ): Promise<Database['public']['Tables'][T]['Row'] | null> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        logger.error(`Error creating ${table}:`, error);
        throw error;
      }

      return result;
    } catch (error) {
      logger.error(`Database create error for ${table}:`, error);
      throw error;
    }
  }

  // Generic find by ID method
  static async findById<T extends keyof Database['public']['Tables']>(
    table: T,
    id: number
  ): Promise<Database['public']['Tables'][T]['Row'] | null> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        logger.error(`Error finding ${table} by ID:`, error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error(`Database findById error for ${table}:`, error);
      throw error;
    }
  }

  // Generic find all method
  static async findAll<T extends keyof Database['public']['Tables']>(
    table: T,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
      filters?: Record<string, any>;
    }
  ): Promise<Database['public']['Tables'][T]['Row'][]> {
    try {
      let query = supabase.from(table).select('*');

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.orderDirection === 'asc' });
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error(`Error finding all ${table}:`, error);
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error(`Database findAll error for ${table}:`, error);
      throw error;
    }
  }

  // Generic update method
  static async update<T extends keyof Database['public']['Tables']>(
    table: T,
    id: number,
    data: Database['public']['Tables'][T]['Update']
  ): Promise<Database['public']['Tables'][T]['Row'] | null> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error(`Error updating ${table}:`, error);
        throw error;
      }

      return result;
    } catch (error) {
      logger.error(`Database update error for ${table}:`, error);
      throw error;
    }
  }

  // Generic delete method
  static async delete<T extends keyof Database['public']['Tables']>(
    table: T,
    id: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        logger.error(`Error deleting ${table}:`, error);
        throw error;
      }

      return true;
    } catch (error) {
      logger.error(`Database delete error for ${table}:`, error);
      throw error;
    }
  }

  // Generic find by field method
  static async findByField<T extends keyof Database['public']['Tables']>(
    table: T,
    field: string,
    value: any
  ): Promise<Database['public']['Tables'][T]['Row'] | null> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(field, value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        logger.error(`Error finding ${table} by ${field}:`, error);
        throw error;
      }

      return data;
    } catch (error) {
      logger.error(`Database findByField error for ${table}:`, error);
      throw error;
    }
  }

  // Generic find many by field method
  static async findManyByField<T extends keyof Database['public']['Tables']>(
    table: T,
    field: string,
    value: any,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
    }
  ): Promise<Database['public']['Tables'][T]['Row'][]> {
    try {
      let query = supabase
        .from(table)
        .select('*')
        .eq(field, value);

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.orderDirection === 'asc' });
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error(`Error finding many ${table} by ${field}:`, error);
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error(`Database findManyByField error for ${table}:`, error);
      throw error;
    }
  }

  // Generic count method
  static async count<T extends keyof Database['public']['Tables']>(
    table: T,
    filters?: Record<string, any>
  ): Promise<number> {
    try {
      let query = supabase.from(table).select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { count, error } = await query;

      if (error) {
        logger.error(`Error counting ${table}:`, error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      logger.error(`Database count error for ${table}:`, error);
      throw error;
    }
  }

  // Generic search method
  static async search<T extends keyof Database['public']['Tables']>(
    table: T,
    searchTerm: string,
    searchFields: string[],
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
    }
  ): Promise<Database['public']['Tables'][T]['Row'][]> {
    try {
      let query = supabase.from(table).select('*');

      // Apply search filters
      if (searchFields.length > 0) {
        const searchConditions = searchFields.map(field => `${field}.ilike.%${searchTerm}%`);
        query = query.or(searchConditions.join(','));
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.orderDirection === 'asc' });
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error(`Error searching ${table}:`, error);
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error(`Database search error for ${table}:`, error);
      throw error;
    }
  }
}
