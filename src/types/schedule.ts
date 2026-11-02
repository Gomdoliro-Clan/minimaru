export interface Schedule {
  applicationStart: string;
  applicationEnd: string;
  firstAnnouncement: string;
  finalAnnouncement: string;
}

export type Phase =
  | 'BEFORE_APPLICATION'
  | 'APPLICATION'
  | 'AFTER_APPLICATION'
  | 'FIRST_ANNOUNCED'
  | 'FINAL_ANNOUNCED';
