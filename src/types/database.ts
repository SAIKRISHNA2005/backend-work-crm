// Database types for Supabase/PostgreSQL - generated to mirror docs/supabase-schema.sql

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: { id: number; name: string; address: string | null; location: string | null; contact_info: string | null; created_at: string; updated_at: string };
        Insert: { id?: number; name: string; address?: string | null; location?: string | null; contact_info?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: number; name?: string; address?: string | null; location?: string | null; contact_info?: string | null; created_at?: string; updated_at?: string };
      };
      classes: {
        Row: { id: number; school_id: number; name: string; section: string | null; room_number: string | null; home_teacher_id: number | null; created_at: string; updated_at: string };
        Insert: { id?: number; school_id: number; name: string; section?: string | null; room_number?: string | null; home_teacher_id?: number | null; created_at?: string; updated_at?: string };
        Update: { id?: number; school_id?: number; name?: string; section?: string | null; room_number?: string | null; home_teacher_id?: number | null; created_at?: string; updated_at?: string };
      };
      users: {
        Row: { id: number; username: string; email: string | null; phone: string | null; password_hash: string; role: 'student' | 'teacher' | 'admin' | 'super_admin'; status: string; created_at: string; updated_at: string };
        Insert: { id?: number; username: string; email?: string | null; phone?: string | null; password_hash: string; role: 'student' | 'teacher' | 'admin' | 'super_admin'; status?: string; created_at?: string; updated_at?: string };
        Update: { id?: number; username?: string; email?: string | null; phone?: string | null; password_hash?: string; role?: 'student' | 'teacher' | 'admin' | 'super_admin'; status?: string; created_at?: string; updated_at?: string };
      };
      student_profiles: {
        Row: { id: number; user_id: number; school_id: number; class_id: number; roll_number: string | null; name: string; father_name: string | null; mother_name: string | null; father_occupation: string | null; mother_occupation: string | null; blood_group: string | null; father_contact: string | null; mother_contact: string | null; aadhar_number: string | null; bio: string | null; superpowers: string | null; current_mission: string | null; side_quests: string | null; joined_on: string | null; address: string | null; location: string | null; fee_payment_status: string | null; event_registration_info: string | null; classwise_leaderboard_rank: number | null; overall_leaderboard_rank: number | null; active_courses: string | null; created_at: string; updated_at: string };
        Insert: { id?: number; user_id: number; school_id: number; class_id: number; roll_number?: string | null; name: string; father_name?: string | null; mother_name?: string | null; father_occupation?: string | null; mother_occupation?: string | null; blood_group?: string | null; father_contact?: string | null; mother_contact?: string | null; aadhar_number?: string | null; bio?: string | null; superpowers?: string | null; current_mission?: string | null; side_quests?: string | null; joined_on?: string | null; address?: string | null; location?: string | null; fee_payment_status?: string | null; event_registration_info?: string | null; classwise_leaderboard_rank?: number | null; overall_leaderboard_rank?: number | null; active_courses?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: number; user_id?: number; school_id?: number; class_id?: number; roll_number?: string | null; name?: string; father_name?: string | null; mother_name?: string | null; father_occupation?: string | null; mother_occupation?: string | null; blood_group?: string | null; father_contact?: string | null; mother_contact?: string | null; aadhar_number?: string | null; bio?: string | null; superpowers?: string | null; current_mission?: string | null; side_quests?: string | null; joined_on?: string | null; address?: string | null; location?: string | null; fee_payment_status?: string | null; event_registration_info?: string | null; classwise_leaderboard_rank?: number | null; overall_leaderboard_rank?: number | null; active_courses?: string | null; created_at?: string; updated_at?: string };
      };
      teacher_profiles: {
        Row: { id: number; user_id: number; school_id: number; name: string; phone: string | null; email: string | null; blood_group: string | null; address: string | null; handling_classes: string | null; home_class_id: number | null; subjects_handled: string | null; personal_attendance_percent: number | null; leaves_count: number; salary_status: string | null; created_at: string; updated_at: string };
        Insert: { id?: number; user_id: number; school_id: number; name: string; phone?: string | null; email?: string | null; blood_group?: string | null; address?: string | null; handling_classes?: string | null; home_class_id?: number | null; subjects_handled?: string | null; personal_attendance_percent?: number | null; leaves_count?: number; salary_status?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: number; user_id?: number; school_id?: number; name?: string; phone?: string | null; email?: string | null; blood_group?: string | null; address?: string | null; handling_classes?: string | null; home_class_id?: number | null; subjects_handled?: string | null; personal_attendance_percent?: number | null; leaves_count?: number; salary_status?: string | null; created_at?: string; updated_at?: string };
      };
      subjects: {
        Row: { id: number; class_id: number; school_id: number; subject_name: string; teacher_id: number | null; created_at: string; updated_at: string };
        Insert: { id?: number; class_id: number; school_id: number; subject_name: string; teacher_id?: number | null; created_at?: string; updated_at?: string };
        Update: { id?: number; class_id?: number; school_id?: number; subject_name?: string; teacher_id?: number | null; created_at?: string; updated_at?: string };
      };
      exams: {
        Row: { id: number; class_id: number; school_id: number; exam_name: string | null; start_date: string | null; end_date: string | null; created_at: string; updated_at: string };
        Insert: { id?: number; class_id: number; school_id: number; exam_name?: string | null; start_date?: string | null; end_date?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: number; class_id?: number; school_id?: number; exam_name?: string | null; start_date?: string | null; end_date?: string | null; created_at?: string; updated_at?: string };
      };
      exam_subjects: {
        Row: { id: number; exam_id: number; subject_id: number; exam_date: string | null; start_time: string | null; end_time: string | null };
        Insert: { id?: number; exam_id: number; subject_id: number; exam_date?: string | null; start_time?: string | null; end_time?: string | null };
        Update: { id?: number; exam_id?: number; subject_id?: number; exam_date?: string | null; start_time?: string | null; end_time?: string | null };
      };
      marks: {
        Row: { id: number; student_id: number; exam_subject_id: number; marks_obtained: number; grade: string | null; created_at: string; updated_at: string };
        Insert: { id?: number; student_id: number; exam_subject_id: number; marks_obtained: number; grade?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: number; student_id?: number; exam_subject_id?: number; marks_obtained?: number; grade?: string | null; created_at?: string; updated_at?: string };
      };
      academic_calendar: {
        Row: { id: number; class_id: number | null; school_id: number | null; month: number | null; event_type: 'holiday' | 'exam' | 'parent_meeting' | 'other' | null; title: string | null; description: string | null; start_date: string | null; end_date: string | null; created_at: string; updated_at: string };
        Insert: { id?: number; class_id?: number | null; school_id?: number | null; month?: number | null; event_type?: 'holiday' | 'exam' | 'parent_meeting' | 'other' | null; title?: string | null; description?: string | null; start_date?: string | null; end_date?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: number; class_id?: number | null; school_id?: number | null; month?: number | null; event_type?: 'holiday' | 'exam' | 'parent_meeting' | 'other' | null; title?: string | null; description?: string | null; start_date?: string | null; end_date?: string | null; created_at?: string; updated_at?: string };
      };
      student_timetable: {
        Row: { id: number; student_id: number | null; class_id: number | null; subject_id: number | null; day_of_week: string | null; start_time: string | null; end_time: string | null; class_type: 'theory' | 'lab' | 'break' | 'lunch' | 'activity' | null; teacher_id: number | null; created_at: string; updated_at: string };
        Insert: { id?: number; student_id?: number | null; class_id?: number | null; subject_id?: number | null; day_of_week?: string | null; start_time?: string | null; end_time?: string | null; class_type?: 'theory' | 'lab' | 'break' | 'lunch' | 'activity' | null; teacher_id?: number | null; created_at?: string; updated_at?: string };
        Update: { id?: number; student_id?: number | null; class_id?: number | null; subject_id?: number | null; day_of_week?: string | null; start_time?: string | null; end_time?: string | null; class_type?: 'theory' | 'lab' | 'break' | 'lunch' | 'activity' | null; teacher_id?: number | null; created_at?: string; updated_at?: string };
      };
      teacher_timetable: {
        Row: { id: number; teacher_id: number | null; class_id: number | null; subject_id: number | null; day_of_week: string | null; start_time: string | null; end_time: string | null; class_type: string | null; room_number: string | null; created_at: string; updated_at: string };
        Insert: { id?: number; teacher_id?: number | null; class_id?: number | null; subject_id?: number | null; day_of_week?: string | null; start_time?: string | null; end_time?: string | null; class_type?: string | null; room_number?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: number; teacher_id?: number | null; class_id?: number | null; subject_id?: number | null; day_of_week?: string | null; start_time?: string | null; end_time?: string | null; class_type?: string | null; room_number?: string | null; created_at?: string; updated_at?: string };
      };
      student_attendance: {
        Row: { id: number; student_id: number; class_id: number; teacher_id: number | null; date: string; status: 'present' | 'absent' | 'late'; leave_request_status: 'accepted' | 'rejected' | 'pending' | null; created_at: string; updated_at: string };
        Insert: { id?: number; student_id: number; class_id: number; teacher_id?: number | null; date: string; status: 'present' | 'absent' | 'late'; leave_request_status?: 'accepted' | 'rejected' | 'pending' | null; created_at?: string; updated_at?: string };
        Update: { id?: number; student_id?: number; class_id?: number; teacher_id?: number | null; date?: string; status?: 'present' | 'absent' | 'late'; leave_request_status?: 'accepted' | 'rejected' | 'pending' | null; created_at?: string; updated_at?: string };
      };
      teacher_attendance: {
        Row: { id: number; teacher_id: number; date: string | null; status: 'present' | 'absent' | 'late' | null; leave_request_status: 'accepted' | 'rejected' | 'pending' | null; leave_start_date: string | null; leave_end_date: string | null; created_at: string; updated_at: string };
        Insert: { id?: number; teacher_id: number; date?: string | null; status?: 'present' | 'absent' | 'late' | null; leave_request_status?: 'accepted' | 'rejected' | 'pending' | null; leave_start_date?: string | null; leave_end_date?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: number; teacher_id?: number; date?: string | null; status?: 'present' | 'absent' | 'late' | null; leave_request_status?: 'accepted' | 'rejected' | 'pending' | null; leave_start_date?: string | null; leave_end_date?: string | null; created_at?: string; updated_at?: string };
      };
      events: {
        Row: { id: number; school_id: number | null; title: string | null; description: string | null; location: string | null; date: string | null; time: string | null; venue: string | null; status: 'upcoming' | 'ongoing' | 'past' | null; created_at: string; updated_at: string };
        Insert: { id?: number; school_id?: number | null; title?: string | null; description?: string | null; location?: string | null; date?: string | null; time?: string | null; venue?: string | null; status?: 'upcoming' | 'ongoing' | 'past' | null; created_at?: string; updated_at?: string };
        Update: { id?: number; school_id?: number | null; title?: string | null; description?: string | null; location?: string | null; date?: string | null; time?: string | null; venue?: string | null; status?: 'upcoming' | 'ongoing' | 'past' | null; created_at?: string; updated_at?: string };
      };
      student_event_registration: {
        Row: { id: number; student_id: number; event_id: number; registration_status: string | null };
        Insert: { id?: number; student_id: number; event_id: number; registration_status?: string | null };
        Update: { id?: number; student_id?: number; event_id?: number; registration_status?: string | null };
      };
      announcements: {
        Row: { id: number; school_id: number | null; class_id: number | null; title: string | null; description: string | null; date: string | null; created_by: number | null };
        Insert: { id?: number; school_id?: number | null; class_id?: number | null; title?: string | null; description?: string | null; date?: string | null; created_by?: number | null };
        Update: { id?: number; school_id?: number | null; class_id?: number | null; title?: string | null; description?: string | null; date?: string | null; created_by?: number | null };
      };
      achievements: {
        Row: { id: number; student_id: number; title: string | null; description: string | null; date: string | null; location: string | null; award_type: string | null };
        Insert: { id?: number; student_id: number; title?: string | null; description?: string | null; date?: string | null; location?: string | null; award_type?: string | null };
        Update: { id?: number; student_id?: number; title?: string | null; description?: string | null; date?: string | null; location?: string | null; award_type?: string | null };
      };
      reminders: {
        Row: { id: number; user_id: number; title: string | null; description: string | null; reminder_date: string | null; status: 'pending' | 'completed' | null };
        Insert: { id?: number; user_id: number; title?: string | null; description?: string | null; reminder_date?: string | null; status?: 'pending' | 'completed' | null };
        Update: { id?: number; user_id?: number; title?: string | null; description?: string | null; reminder_date?: string | null; status?: 'pending' | 'completed' | null };
      };
      enquiries: {
        Row: { id: number; user_id: number | null; subject: string | null; category: string | null; description: string | null; status: 'active' | 'resolved' | 'support' | null; date: string | null; priority: string | null; last_update: string | null; actions_taken: string | null; attachment_url: string | null };
        Insert: { id?: number; user_id?: number | null; subject?: string | null; category?: string | null; description?: string | null; status?: 'active' | 'resolved' | 'support' | null; date?: string | null; priority?: string | null; last_update?: string | null; actions_taken?: string | null; attachment_url?: string | null };
        Update: { id?: number; user_id?: number | null; subject?: string | null; category?: string | null; description?: string | null; status?: 'active' | 'resolved' | 'support' | null; date?: string | null; priority?: string | null; last_update?: string | null; actions_taken?: string | null; attachment_url?: string | null };
      };
      fee_structure: {
        Row: { id: number; class_id: number; fee_name: string | null; description: string | null; amount: number | null; due_date: string | null };
        Insert: { id?: number; class_id: number; fee_name?: string | null; description?: string | null; amount?: number | null; due_date?: string | null };
        Update: { id?: number; class_id?: number; fee_name?: string | null; description?: string | null; amount?: number | null; due_date?: string | null };
      };
      fee_payments: {
        Row: { id: number; student_id: number; class_id: number; fee_id: number; status: 'paid' | 'pending' | null; payment_date: string | null; transaction_id: string | null };
        Insert: { id?: number; student_id: number; class_id: number; fee_id: number; status?: 'paid' | 'pending' | null; payment_date?: string | null; transaction_id?: string | null };
        Update: { id?: number; student_id?: number; class_id?: number; fee_id?: number; status?: 'paid' | 'pending' | null; payment_date?: string | null; transaction_id?: string | null };
      };
      leaderboard: {
        Row: { id: number; student_id: number; class_id: number; school_id: number; xp: number | null; percentage: number | null; classwise_rank: number | null; overall_rank: number | null };
        Insert: { id?: number; student_id: number; class_id: number; school_id: number; xp?: number | null; percentage?: number | null; classwise_rank?: number | null; overall_rank?: number | null };
        Update: { id?: number; student_id?: number; class_id?: number; school_id?: number; xp?: number | null; percentage?: number | null; classwise_rank?: number | null; overall_rank?: number | null };
      };
      digital_notes: {
        Row: { id: number; class_id: number; subject_id: number; section_type: 'note' | 'video' | 'assignment' | null; title: string | null; description: string | null; resource_url: string | null; file_type: string | null; uploaded_at: string; due_date: string | null; is_important: boolean | null; added_by_id: number | null; last_seen_at: string | null };
        Insert: { id?: number; class_id: number; subject_id: number; section_type?: 'note' | 'video' | 'assignment' | null; title?: string | null; description?: string | null; resource_url?: string | null; file_type?: string | null; uploaded_at?: string; due_date?: string | null; is_important?: boolean | null; added_by_id?: number | null; last_seen_at?: string | null };
        Update: { id?: number; class_id?: number; subject_id?: number; section_type?: 'note' | 'video' | 'assignment' | null; title?: string | null; description?: string | null; resource_url?: string | null; file_type?: string | null; uploaded_at?: string; due_date?: string | null; is_important?: boolean | null; added_by_id?: number | null; last_seen_at?: string | null };
      };
      teacher_notes: {
        Row: { id: number; teacher_id: number; class_id: number; subject_id: number | null; title: string | null; description: string | null; file_url: string | null; file_type: string | null; uploaded_at: string; is_published: boolean; visibility: 'class' | 'section' | 'school' | null; available_from: string | null; available_until: string | null; tags: string | null };
        Insert: { id?: number; teacher_id: number; class_id: number; subject_id?: number | null; title?: string | null; description?: string | null; file_url?: string | null; file_type?: string | null; uploaded_at?: string; is_published?: boolean; visibility?: 'class' | 'section' | 'school' | null; available_from?: string | null; available_until?: string | null; tags?: string | null };
        Update: { id?: number; teacher_id?: number; class_id?: number; subject_id?: number | null; title?: string | null; description?: string | null; file_url?: string | null; file_type?: string | null; uploaded_at?: string; is_published?: boolean; visibility?: 'class' | 'section' | 'school' | null; available_from?: string | null; available_until?: string | null; tags?: string | null };
      };
      home_class: {
        Row: { id: number; teacher_id: number; class_id: number };
        Insert: { id?: number; teacher_id: number; class_id: number };
        Update: { id?: number; teacher_id?: number; class_id?: number };
      };
      handling_class: {
        Row: { id: number; teacher_id: number; class_id: number };
        Insert: { id?: number; teacher_id: number; class_id: number };
        Update: { id?: number; teacher_id?: number; class_id?: number };
      };
    };
  };
}