import { BaseModel, BaseInsert, BaseUpdate, DateString, PaymentStatus } from './base';
import { Class } from './school';
import { StudentProfile } from './student';

// Fee Structure Model
export interface FeeStructure extends BaseModel {
  class_id: number;
  fee_name: string;
  description?: string;
  amount: number;
  due_date?: DateString;
}

export interface FeeStructureInsert extends BaseInsert {
  class_id: number;
  fee_name: string;
  description?: string;
  amount: number;
  due_date?: DateString;
}

export interface FeeStructureUpdate extends BaseUpdate {
  class_id?: number;
  fee_name?: string;
  description?: string;
  amount?: number;
  due_date?: DateString;
}

// Fee Payment Model
export interface FeePayment extends BaseModel {
  student_id: number;
  class_id: number;
  fee_id: number;
  status: PaymentStatus;
  payment_date?: DateString;
  transaction_id?: string;
}

export interface FeePaymentInsert extends BaseInsert {
  student_id: number;
  class_id: number;
  fee_id: number;
  status?: PaymentStatus;
  payment_date?: DateString;
  transaction_id?: string;
}

export interface FeePaymentUpdate extends BaseUpdate {
  student_id?: number;
  class_id?: number;
  fee_id?: number;
  status?: PaymentStatus;
  payment_date?: DateString;
  transaction_id?: string;
}

// Financial with related data
export interface FeeStructureWithDetails extends FeeStructure {
  class: Class;
  payments: FeePaymentWithDetails[];
  total_collected: number;
  pending_amount: number;
}

export interface FeePaymentWithDetails extends FeePayment {
  student: StudentProfile;
  class: Class;
  fee_structure: FeeStructure;
}

// Student fee summary
export interface StudentFeeSummary {
  student_id: number;
  student_name: string;
  class_name: string;
  roll_number?: string;
  total_fees: number;
  paid_fees: number;
  pending_fees: number;
  payment_percentage: number;
  fee_details: FeePaymentDetail[];
}

export interface FeePaymentDetail {
  fee_id: number;
  fee_name: string;
  amount: number;
  due_date?: DateString;
  status: PaymentStatus;
  payment_date?: DateString;
  transaction_id?: string;
}

// Class fee summary
export interface ClassFeeSummary {
  class_id: number;
  class_name: string;
  total_students: number;
  total_fees: number;
  collected_fees: number;
  pending_fees: number;
  collection_percentage: number;
  students: StudentFeeSummary[];
}

// Financial search and filter
export interface FeeSearchParams {
  student_id?: number;
  class_id?: number;
  fee_id?: number;
  status?: PaymentStatus;
  payment_date?: DateString;
  start_date?: DateString;
  end_date?: DateString;
  min_amount?: number;
  max_amount?: number;
}

// Financial statistics
export interface FinancialStats {
  total_fees: number;
  collected_fees: number;
  pending_fees: number;
  collection_percentage: number;
  fees_by_class: Record<string, number>;
  collection_by_month: Record<string, number>;
  top_payers: StudentFeeSummary[];
  defaulters: StudentFeeSummary[];
}

// Payment report
export interface PaymentReport {
  period: {
    start_date: DateString;
    end_date: DateString;
  };
  summary: {
    total_fees: number;
    collected_fees: number;
    pending_fees: number;
    collection_percentage: number;
  };
  class_wise_collection: ClassFeeSummary[];
  student_wise_payments: StudentFeeSummary[];
}

// Fee due reminders
export interface FeeDueReminder {
  student_id: number;
  student_name: string;
  class_name: string;
  fee_name: string;
  amount: number;
  due_date: DateString;
  days_overdue: number;
  contact_info: {
    phone?: string;
    email?: string;
  };
}

// Re-export for convenience
export type { FeeStructure, FeePayment };
