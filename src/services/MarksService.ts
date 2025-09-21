import { supabase } from '../config/database';
import { CustomError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class MarksService {

  static async getMarksRecords(filters: any = {}, pagination: { limit: number; offset: number } = { limit: 10, offset: 0 }) {
    try {
      let query = supabase
        .from('marks')
        .select(`
          *,
          students:student_id (
            id,
            name,
            class_code
          ),
          subjects:subject_id (
            id,
            name,
            subject_code
          )
        `);

      // Apply filters
      if (filters.student_id) {
        query = query.eq('student_id', filters.student_id);
      }
      if (filters.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }
      if (filters.exam_type) {
        query = query.eq('exam_type', filters.exam_type);
      }

      // Apply pagination
      query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);

      const { data, error } = await query.order('exam_date', { ascending: false });

      if (error) {
        logger.error('Error fetching marks records:', error);
        throw new CustomError('Failed to fetch marks records', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('MarksService.getMarksRecords error:', error);
      throw error;
    }
  }

  static async getMarksCount(filters: any = {}) {
    try {
      let query = supabase
        .from('marks')
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters.student_id) {
        query = query.eq('student_id', filters.student_id);
      }
      if (filters.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }
      if (filters.exam_type) {
        query = query.eq('exam_type', filters.exam_type);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Error counting marks records:', error);
        throw new CustomError('Failed to count marks records', 500);
      }

      return count || 0;
    } catch (error) {
      logger.error('MarksService.getMarksCount error:', error);
      throw error;
    }
  }

  static async createMarksRecord(marksData: any) {
    try {
      // Calculate grade based on marks
      const grade = this.calculateGrade(marksData.marks_obtained, marksData.total_marks);

      const recordData = {
        ...marksData,
        grade,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('marks')
        .insert([recordData])
        .select(`
          *,
          students:student_id (
            id,
            name,
            class_code
          ),
          subjects:subject_id (
            id,
            name,
            subject_code
          )
        `)
        .single();

      if (error) {
        logger.error('Error creating marks record:', error);
        throw new CustomError('Failed to create marks record', 500);
      }

      return data;
    } catch (error) {
      logger.error('MarksService.createMarksRecord error:', error);
      throw error;
    }
  }

  static async updateMarksRecord(id: number, updateData: any) {
    try {
      // Recalculate grade if marks are being updated
      if (updateData.marks_obtained || updateData.total_marks) {
        const { data: existingRecord } = await supabase
          .from('marks')
          .select('marks_obtained, total_marks')
          .eq('id', id)
          .single();

        if (existingRecord) {
          const marksObtained = updateData.marks_obtained || existingRecord.marks_obtained;
          const totalMarks = updateData.total_marks || existingRecord.total_marks;
          updateData.grade = this.calculateGrade(marksObtained, totalMarks);
        }
      }

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('marks')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          students:student_id (
            id,
            name,
            class_code
          ),
          subjects:subject_id (
            id,
            name,
            subject_code
          )
        `)
        .single();

      if (error) {
        logger.error('Error updating marks record:', error);
        throw new CustomError('Failed to update marks record', 500);
      }

      return data;
    } catch (error) {
      logger.error('MarksService.updateMarksRecord error:', error);
      throw error;
    }
  }

  static async getMarksByStudent(studentId: number, filters: any = {}) {
    try {
      let query = supabase
        .from('marks')
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            subject_code
          )
        `)
        .eq('student_id', studentId);

      if (filters.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }
      if (filters.exam_type) {
        query = query.eq('exam_type', filters.exam_type);
      }

      const { data, error } = await query.order('exam_date', { ascending: false });

      if (error) {
        logger.error('Error fetching student marks:', error);
        throw new CustomError('Failed to fetch student marks', 500);
      }

      return data || [];
    } catch (error) {
      logger.error('MarksService.getMarksByStudent error:', error);
      throw error;
    }
  }

  static async getMarksStats(filters: any = {}) {
    try {
      let query = supabase
        .from('marks')
        .select('marks_obtained, total_marks, exam_type, subject_id');

      // Apply filters
      if (filters.class_id) {
        // Join with student_profiles to filter by class
        query = query.eq('students.class_code', filters.class_id);
      }
      if (filters.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error fetching marks stats:', error);
        throw new CustomError('Failed to fetch marks statistics', 500);
      }

      // Calculate statistics
      const totalRecords = data?.length || 0;
      const totalMarks = data?.reduce((sum, record) => sum + (record.marks_obtained || 0), 0) || 0;
      const averageMarks = totalRecords > 0 ? Math.round((totalMarks / totalRecords) * 100) / 100 : 0;

      // Group by exam type
      const examTypeStats = data?.reduce((acc: any, record) => {
        const examType = record.exam_type || 'Unknown';
        if (!acc[examType]) {
          acc[examType] = { count: 0, totalMarks: 0 };
        }
        acc[examType].count++;
        acc[examType].totalMarks += record.marks_obtained || 0;
        return acc;
      }, {}) || {};

      // Calculate averages for each exam type
      Object.keys(examTypeStats).forEach(examType => {
        examTypeStats[examType].average = examTypeStats[examType].count > 0 
          ? Math.round((examTypeStats[examType].totalMarks / examTypeStats[examType].count) * 100) / 100 
          : 0;
      });

      return {
        totalRecords,
        totalMarks,
        averageMarks,
        examTypeStats,
        period: filters.dateFrom && filters.dateTo ? `${filters.dateFrom} to ${filters.dateTo}` : 'All time'
      };
    } catch (error) {
      logger.error('MarksService.getMarksStats error:', error);
      throw error;
    }
  }

  static async deleteMarksRecord(id: number) {
    try {
      const { error } = await supabase
        .from('marks')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting marks record:', error);
        throw new CustomError('Failed to delete marks record', 500);
      }

      return true;
    } catch (error) {
      logger.error('MarksService.deleteMarksRecord error:', error);
      throw error;
    }
  }

  static async getStudentPerformance(studentId: number) {
    try {
      const { data, error } = await supabase
        .from('marks')
        .select(`
          *,
          subjects:subject_id (
            id,
            name,
            subject_code
          )
        `)
        .eq('student_id', studentId)
        .order('exam_date', { ascending: true });

      if (error) {
        logger.error('Error fetching student performance:', error);
        throw new CustomError('Failed to fetch student performance', 500);
      }

      // Group by subject and exam type for performance analysis
      const performanceData = data?.reduce((acc: any, record) => {
        const subjectName = record.subjects?.name || 'Unknown Subject';
        const examType = record.exam_type || 'Unknown';
        
        if (!acc[subjectName]) {
          acc[subjectName] = {};
        }
        
        if (!acc[subjectName][examType]) {
          acc[subjectName][examType] = [];
        }
        
        acc[subjectName][examType].push({
          marks: record.marks_obtained,
          total: record.total_marks,
          date: record.exam_date,
          grade: record.grade
        });
        
        return acc;
      }, {}) || {};

      return performanceData;
    } catch (error) {
      logger.error('MarksService.getStudentPerformance error:', error);
      throw error;
    }
  }

  private static calculateGrade(marksObtained: number, totalMarks: number): string {
    if (!marksObtained || !totalMarks) return 'N/A';
    
    const percentage = (marksObtained / totalMarks) * 100;
    
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 35) return 'D';
    return 'F';
  }
}
