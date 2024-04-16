import { OpenloginUserInfo } from "@toruslabs/openlogin-utils";

// Определение типа статуса задачи
export type TaskStatus = 1 | 2 | 3 | 4;

export type StatusMap = {
  [key: string]: number;
};
// Использование Record для BoardItem
export type BoardItem = Record<TaskStatus, Task[]>;

interface WorkspaceNode {
  __typename: string;
  background: string;
  colors: string[][];
  created_at: string;
  id: string;
  title: string;
  type: string;
  updated_at: string;
  user_id: string;
  workspace_id: string;
}

export type Workspace = {
  __typename: string;
  node: WorkspaceNode;
};

export type WorkspaceArray = Workspace[];

interface PassportNode {
  __typename: string;
  background: string;
  colors: string[][];
  created_at: string;
  id: string;
  title: string;
  type: string;
  updated_at: string;
  user_id: string;
  workspace_id: string;
  photo_url: string;
  username: string;
}
export type Passport = {
  __typename: string;
  node: PassportNode;
};

export type PassportArray = Passport[];

export type TasksArray = Task[];

type TaskNode = {
  __typename: string;
  id: string;
  user_id: string;
  created_at: string;
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
  background: string;
  colors: string[][];
  type: string;
  workspace_id: string;
};

export interface Task {
  __typename: string;
  node: TaskNode;
}

export interface User {
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  inviter: string | null;
  photo_url: string | null;
  is_bot: boolean | null;
  language_code: string | null;
  telegram_id: number | null;
  email: string | null;
}

export type TUser = Readonly<{
  auth_date?: number;
  first_name: string;
  last_name?: string;
  hash?: string;
  id?: number;
  photo_url?: string;
  username?: string;
}>;

export type SupabaseUser = TUser & {
  inviter?: string | null;
  is_bot?: boolean | null;
  language_code?: string | null;
  telegram_id?: number | null;
  email?: string | null;
  created_at?: Date;
  user_id?: string;
  aggregateverifier?: string | null;
  admin_email?: string | null;
  role?: string | null;
  display_name?: string | null;
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

export interface OptionType {
  value: string;
  label: string;
  color?: string;
}

export interface RoomT {
  id: number;
  created_at: string;
  updated_at?: string;
  workspace_id?: string;
  type?: string;
  id_additional?: string;
  name?: string;
  enabled?: boolean;
  description?: string;
  customer_id?: string;
  app_id?: string;
  recording_info?: Record<string, any> | null;
  template_id?: string;
  template?: string;
  region?: string;
  customer?: string;
  large_room?: boolean;
  codes?: Record<string, any> | null;
  type_additional?: string;
  user_id?: string;
  room_id: string;
  lang?: string;
  chat_id?: string;
  token?: string;
  username?: string;
  original_name?: string;
  public?: boolean;
}

export type CardRoomT = {
  node: RoomT;
};

export interface ResponseData {
  data?: any;
  message?: string;
  error?: {
    message: string;
  };
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

export interface RoomEdge {
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

export type ArrayInviteT = {
  text: string;
  type: string;
};
