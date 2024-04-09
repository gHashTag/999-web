import { OpenloginUserInfo } from "@toruslabs/openlogin-utils";

// Определение типа статуса задачи
export type TaskStatus = 1 | 2 | 3 | 4;

export type StatusMap = {
  [key: string]: number;
};
// Использование Record для BoardItem
export type BoardItem = Record<TaskStatus, Task[]>;

export type TasksArray = Task[];

export interface Task {
  __typename: string;
  node: {
    id: string;
    user_id: string;
    created_at?: string;
    title: string;
    description: string;
    updated_at?: string;
    due_date?: string;
    priority?: number;
    assigned_to?: AssignedUser[];
    label?: string[];
    completed_at?: string;
    is_archived?: boolean;
    status: TaskStatus;
    order: number;
  };
}

export type SupabaseUser = {
  id: number;
  created_at: Date;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  is_bot: boolean | null;
  language_code: string | null;
  telegram_id: number | null;
  email: string | null;
  photo_url: string | null;
  user_id: string;
  aggregateverifier: string | null;
  admin_email: string | null;
  role: string | null;
  display_name: string | null;
  inviter: string | null;
};

// Дополнительно, вы можете определить тип для таблицы users
export type UsersTable = SupabaseUser[];

export interface DropResult {
  draggableId: string;
  type: string;
  reason: string;
  source: {
    index: number;
    droppableId: string;
  };
  destination?: {
    droppableId: string;
    index: number;
  };
}

// Если assigned_to использует jsonb для хранения нескольких назначений
export interface AssignedUser {
  user_id: string; // UUID назначенного пользователя
  // Дополнительные поля, если необходимо
}

export interface BoardData {
  title: string;
  id: string;
  cards?: Task[];
}

export interface CardInfo {
  id: string;
  title: string;
  description: string;
}

export type Board = {
  [key: string]: Task[];
};

export type RecordingAsset = {
  account_id: string;
  title: string;
  app_id: string;
  duration: number;
  email: string | null;
  id: number;
  metadata_id: string;
  metadata_timestamp: string;
  recording_id: string;
  room_id: string;
  room_name: string;
  session_id: string;
  summary_json_asset_id: string;
  summary_json_path: string;
  summary_json_presigned_url: string;
  summary_short: string;
  transcript_json_asset_id: string;
  transcript_json_path: string;
  transcript_json_presigned_url: string;
  transcript_srt_asset_id: string;
  transcript_srt_path: string;
  transcript_srt_presigned_url: string;
  transcript_txt_asset_id: string;
  transcript_txt_path: string;
  transcript_txt_presigned_url: string;
  transcription: string;
  transcription_id: string;
};

// Rooms Data
interface Code {
  id: string;
  code: string;
  room_id: string;
  role: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface CodesData {
  data: Code[];
}

export interface RoomNode {
  __typename: "rooms";
  id: string;
  user_id: string;
  name: string;
  description: string;
  updated_at: string;
  created_at: string;
  type: string;
  enabled: boolean;
  room_id: string;
  codes: CodesData;
}

interface RoomEdge {
  __typename: "roomsEdge";
  node: RoomNode;
}

export interface RoomsCollection {
  __typename: "roomsConnection";
  edges: RoomEdge[];
}

export interface RoomsData {
  roomsCollection: RoomsCollection;
}

export interface OptionType {
  value: string;
  label: string;
  color?: string;
}
export type CardRoomT = {
  node: {
    id: string;
    name: string;
    description: string;
    type: string;
    room_id: string;
  };
};

export interface ResponseData {
  data?: any;
  message?: string;
  error?: {
    message: string;
  };
}
