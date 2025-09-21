// Models index file - Export all models and types

// Base models and types
export * from './base';

// Core models
export * from './school';
export * from './user';
export * from './student';
export * from './teacher';

// Academic models
export * from './subject';
export * from './exam';
export * from './marks';
export * from './timetable';

// Attendance models
export * from './attendance';

// Event and communication models
export * from './event';
export * from './communication';

// Financial models
export * from './financial';

// Notes and content models
export * from './notes';
export * from './calendar';
export * from './leaderboard';

// Re-export commonly used types for convenience
export type {
  // Base types
  BaseModel,
  BaseInsert,
  BaseUpdate,
  Timestamp,
  DateString,
  TimeString,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  ApiError,
  
  // Enums
  UserRole,
  UserStatus,
  AttendanceStatus,
  LeaveRequestStatus,
  EventStatus,
  EventType,
  ClassType,
  SectionType,
  Visibility,
  PaymentStatus,
  EnquiryStatus,
  ReminderStatus,
} from './base';

// Core entity types
export type {
  School,
  SchoolInsert,
  SchoolUpdate,
  SchoolWithClasses,
  SchoolWithStats,
  Class,
  ClassInsert,
  ClassUpdate,
  ClassWithDetails,
  ClassWithStats,
} from './school';

export type {
  User,
  UserInsert,
  UserUpdate,
  UserPublic,
  UserWithProfile,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PasswordChange,
  UserStats,
} from './user';

export type {
  StudentProfile,
  StudentProfileInsert,
  StudentProfileUpdate,
  StudentWithDetails,
  StudentWithStats,
  StudentLeaderboard,
  StudentSearchParams,
  StudentStats,
} from './student';

export type {
  TeacherProfile,
  TeacherProfileInsert,
  TeacherProfileUpdate,
  TeacherWithDetails,
  TeacherWithStats,
  TeacherSearchParams,
  TeacherStats,
  HomeClass,
  HomeClassInsert,
  HandlingClass,
  HandlingClassInsert,
} from './teacher';

// Academic entity types
export type {
  Subject,
  SubjectInsert,
  SubjectUpdate,
  SubjectWithDetails,
  SubjectWithStats,
  SubjectSearchParams,
  SubjectStats,
} from './subject';

export type {
  Exam,
  ExamInsert,
  ExamUpdate,
  ExamWithDetails,
  ExamSubject,
  ExamSubjectInsert,
  ExamSubjectUpdate,
  ExamSubjectWithDetails,
  ExamSearchParams,
  ExamStats,
  ExamPerformance,
  ExamSchedule,
} from './exam';

export type {
  Mark,
  MarkInsert,
  MarkUpdate,
  MarkWithDetails,
  MarkStats,
  StudentMarksSummary,
  SubjectMark,
  ClassMarksSummary,
  MarkSearchParams,
  GradeScale,
} from './marks';

export type {
  StudentTimetable,
  StudentTimetableInsert,
  StudentTimetableUpdate,
  StudentTimetableWithDetails,
  TeacherTimetable,
  TeacherTimetableInsert,
  TeacherTimetableUpdate,
  TeacherTimetableWithDetails,
  WeeklyTimetable,
  TimetablePeriod,
  StudentWeeklyTimetable,
  TeacherWeeklyTimetable,
  TimetableSearchParams,
  TimetableStats,
  TimetableConflict,
} from './timetable';

// Attendance types
export type {
  StudentAttendance,
  StudentAttendanceInsert,
  StudentAttendanceUpdate,
  StudentAttendanceWithDetails,
  TeacherAttendance,
  TeacherAttendanceInsert,
  TeacherAttendanceUpdate,
  TeacherAttendanceWithDetails,
  AttendanceStats,
  StudentAttendanceSummary,
  ClassAttendanceSummary,
  TeacherAttendanceSummary,
  AttendanceSearchParams,
  LeaveRequest,
  LeaveRequestInsert,
  AttendanceReport,
  FeeDueReminder,
} from './attendance';

// Event and communication types
export type {
  Event,
  EventInsert,
  EventUpdate,
  EventWithDetails,
  StudentEventRegistration,
  StudentEventRegistrationInsert,
  StudentEventRegistrationUpdate,
  StudentEventRegistrationWithDetails,
  EventSearchParams,
  EventStats,
  EventCalendar,
  EventRegistrationSummary,
} from './event';

export type {
  Announcement,
  AnnouncementInsert,
  AnnouncementUpdate,
  AnnouncementWithDetails,
  Achievement,
  AchievementInsert,
  AchievementUpdate,
  AchievementWithDetails,
  Reminder,
  ReminderInsert,
  ReminderUpdate,
  ReminderWithDetails,
  Enquiry,
  EnquiryInsert,
  EnquiryUpdate,
  EnquiryWithDetails,
  AnnouncementSearchParams,
  AchievementSearchParams,
  ReminderSearchParams,
  EnquirySearchParams,
  CommunicationStats,
  CommunicationDashboard,
} from './communication';

// Financial types
export type {
  FeeStructure,
  FeeStructureInsert,
  FeeStructureUpdate,
  FeeStructureWithDetails,
  FeePayment,
  FeePaymentInsert,
  FeePaymentUpdate,
  FeePaymentWithDetails,
  StudentFeeSummary,
  FeePaymentDetail,
  ClassFeeSummary,
  FeeSearchParams,
  FinancialStats,
  PaymentReport,
} from './financial';

// Notes and content types
export type {
  DigitalNote,
  DigitalNoteInsert,
  DigitalNoteUpdate,
  DigitalNoteWithDetails,
  TeacherNote,
  TeacherNoteInsert,
  TeacherNoteUpdate,
  TeacherNoteWithDetails,
  DigitalNoteSearchParams,
  TeacherNoteSearchParams,
  NotesStats,
  StudentNotesDashboard,
  TeacherNotesDashboard,
  FileUpload,
  TeacherFileUpload,
} from './notes';

export type {
  AcademicCalendar,
  AcademicCalendarInsert,
  AcademicCalendarUpdate,
  AcademicCalendarWithDetails,
  CalendarSearchParams,
  MonthlyCalendar,
  CalendarEvent,
  CalendarStats,
  CalendarDashboard,
} from './calendar';

export type {
  Leaderboard,
  LeaderboardInsert,
  LeaderboardUpdate,
  LeaderboardWithDetails,
  LeaderboardSearchParams,
  LeaderboardStats,
  ClassLeaderboardStats,
  LeaderboardRankings,
  XPAchievement,
  XPAchievementInsert,
  StudentProgress,
  LeaderboardDashboard,
} from './leaderboard';
