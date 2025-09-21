// Database types for Supabase/PostgreSQL

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: number;
          name: string;
          address: string | null;
          location: string | null;
          contact_info: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          address?: string | null;
          location?: string | null;
          contact_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          address?: string | null;
          location?: string | null;
          contact_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      classes: {
        Row: {
          id: number;
          school_id: number;
          name: string;
          section: string | null;
          room_number: string | null;
          home_teacher_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          school_id: number;
          name: string;
          section?: string | null;
          room_number?: string | null;
          home_teacher_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          school_id?: number;
          name?: string;
          section?: string | null;
          room_number?: string | null;
          home_teacher_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: number;
          username: string;
          email: string | null;
          phone: string | null;
          password_hash: string;
          role: 'student' | 'teacher' | 'admin' | 'super_admin';
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          username: string;
          email?: string | null;
          phone?: string | null;
          password_hash: string;
          role: 'student' | 'teacher' | 'admin' | 'super_admin';
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          username?: string;
          email?: string | null;
          phone?: string | null;
          password_hash?: string;
          role?: 'student' | 'teacher' | 'admin' | 'super_admin';
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      student_profiles: {
        Row: {
          id: number;
          user_id: number;
          school_id: number;
          class_id: number;
          roll_number: string | null;
          name: string;
          father_name: string | null;
          mother_name: string | null;
          father_occupation: string | null;
          mother_occupation: string | null;
          blood_group: string | null;
          father_contact: string | null;
          mother_contact: string | null;
          aadhar_number: string | null;
          bio: string | null;
          superpowers: string | null;
          current_mission: string | null;
          side_quests: string | null;
          joined_on: string | null;
          address: string | null;
          location: string | null;
          fee_payment_status: string | null;
          event_registration_info: string | null;
          classwise_leaderboard_rank: number | null;
          overall_leaderboard_rank: number | null;
          active_courses: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: number;
          school_id: number;
          class_id: number;
          roll_number?: string | null;
          name: string;
          father_name?: string | null;
          mother_name?: string | null;
          father_occupation?: string | null;
          mother_occupation?: string | null;
          blood_group?: string | null;
          father_contact?: string | null;
          mother_contact?: string | null;
          aadhar_number?: string | null;
          bio?: string | null;
          superpowers?: string | null;
          current_mission?: string | null;
          side_quests?: string | null;
          joined_on?: string | null;
          address?: string | null;
          location?: string | null;
          fee_payment_status?: string | null;
          event_registration_info?: string | null;
          classwise_leaderboard_rank?: number | null;
          overall_leaderboard_rank?: number | null;
          active_courses?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number;
          school_id?: number;
          class_id?: number;
          roll_number?: string | null;
          name?: string;
          father_name?: string | null;
          mother_name?: string | null;
          father_occupation?: string | null;
          mother_occupation?: string | null;
          blood_group?: string | null;
          father_contact?: string | null;
          mother_contact?: string | null;
          aadhar_number?: string | null;
          bio?: string | null;
          superpowers?: string | null;
          current_mission?: string | null;
          side_quests?: string | null;
          joined_on?: string | null;
          address?: string | null;
          location?: string | null;
          fee_payment_status?: string | null;
          event_registration_info?: string | null;
          classwise_leaderboard_rank?: number | null;
          overall_leaderboard_rank?: number | null;
          active_courses?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      teacher_profiles: {
        Row: {
          id: number;
          user_id: number;
          school_id: number;
          name: string;
          phone: string | null;
          email: string | null;
          blood_group: string | null;
          address: string | null;
          handling_classes: string | null;
          home_class_id: number | null;
          subjects_handled: string | null;
          personal_attendance_percent: number | null;
          leaves_count: number;
          salary_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: number;
          school_id: number;
          name: string;
          phone?: string | null;
          email?: string | null;
          blood_group?: string | null;
          address?: string | null;
          handling_classes?: string | null;
          home_class_id?: number | null;
          subjects_handled?: string | null;
          personal_attendance_percent?: number | null;
          leaves_count?: number;
          salary_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number;
          school_id?: number;
          name?: string;
          phone?: string | null;
          email?: string | null;
          blood_group?: string | null;
          address?: string | null;
          handling_classes?: string | null;
          home_class_id?: number | null;
          subjects_handled?: string | null;
          personal_attendance_percent?: number | null;
          leaves_count?: number;
          salary_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: number;
          class_id: number;
          school_id: number;
          subject_name: string;
          teacher_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          class_id: number;
          school_id: number;
          subject_name: string;
          teacher_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          class_id?: number;
          school_id?: number;
          subject_name?: string;
          teacher_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      student_attendance: {
        Row: {
          id: number;
          student_id: number;
          class_id: number;
          teacher_id: number | null;
          date: string;
          status: 'present' | 'absent' | 'late';
          leave_request_status: 'accepted' | 'rejected' | 'pending' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          student_id: number;
          class_id: number;
          teacher_id?: number | null;
          date: string;
          status: 'present' | 'absent' | 'late';
          leave_request_status?: 'accepted' | 'rejected' | 'pending' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          student_id?: number;
          class_id?: number;
          teacher_id?: number | null;
          date?: string;
          status?: 'present' | 'absent' | 'late';
          leave_request_status?: 'accepted' | 'rejected' | 'pending' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      marks: {
        Row: {
          id: number;
          student_id: number;
          exam_subject_id: number;
          marks_obtained: number;
          grade: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          student_id: number;
          exam_subject_id: number;
          marks_obtained: number;
          grade?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          student_id?: number;
          exam_subject_id?: number;
          marks_obtained?: number;
          grade?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: number;
          school_id: number | null;
          title: string | null;
          description: string | null;
          location: string | null;
          date: string | null;
          time: string | null;
          venue: string | null;
          status: 'upcoming' | 'ongoing' | 'past' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          school_id?: number | null;
          title?: string | null;
          description?: string | null;
          location?: string | null;
          date?: string | null;
          time?: string | null;
          venue?: string | null;
          status?: 'upcoming' | 'ongoing' | 'past' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          school_id?: number | null;
          title?: string | null;
          description?: string | null;
          location?: string | null;
          date?: string | null;
          time?: string | null;
          venue?: string | null;
          status?: 'upcoming' | 'ongoing' | 'past' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      teacher_notes: {
        Row: {
          id: number;
          teacher_id: number;
          class_id: number;
          subject_id: number | null;
          title: string | null;
          description: string | null;
          file_url: string | null;
          file_type: string | null;
          uploaded_at: string;
          is_published: boolean;
          visibility: 'class' | 'section' | 'school' | null;
          available_from: string | null;
          available_until: string | null;
          tags: string | null;
        };
        Insert: {
          id?: number;
          teacher_id: number;
          class_id: number;
          subject_id?: number | null;
          title?: string | null;
          description?: string | null;
          file_url?: string | null;
          file_type?: string | null;
          uploaded_at?: string;
          is_published?: boolean;
          visibility?: 'class' | 'section' | 'school' | null;
          available_from?: string | null;
          available_until?: string | null;
          tags?: string | null;
        };
        Update: {
          id?: number;
          teacher_id?: number;
          class_id?: number;
          subject_id?: number | null;
          title?: string | null;
          description?: string | null;
          file_url?: string | null;
          file_type?: string | null;
          uploaded_at?: string;
          is_published?: boolean;
          visibility?: 'class' | 'section' | 'school' | null;
          available_from?: string | null;
          available_until?: string | null;
          tags?: string | null;
        };
      };
    };
  };
}
