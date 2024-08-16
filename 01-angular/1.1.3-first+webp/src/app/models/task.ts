export interface Attachment {
  id: number;
  path: string;
  date_upload: string;
  text_form: string;
  path_compress: string;
  type: 'IMAGE' | 'FILE' | 'VOICE';
}

export interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  end_at: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  is_parent: boolean;
  category: number;
  parent: number | null;
  attachments: Attachment[];
  subtasks: Task[];
}

export interface TaskResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}
