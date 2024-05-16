import { OpenloginUserInfo } from "@toruslabs/openlogin-utils";
import { Sticker } from "grammy/types";

// Определение типа статуса задачи
export type TaskStatus = "todo" | "in_progress" | "done" | "archived";

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

export type AssignedTo = {
  user_id: string | undefined;
  username: string | undefined;
  photo_url: string | undefined;
  passport_id?: number;
};

export interface PassportNode extends AssignedTo {
  __typename?: string;
  background?: string;
  colors?: string[][];
  created_at?: string;
  id?: string;
  title?: string;
  type?: "room" | "workspace" | "task";
  first_name?: string;
  last_name?: string;
  updated_at?: string;
  workspace_id?: string;
  is_owner?: boolean;
  room_id?: string;
  assigned_to?: Passport[];
  rooms?: RoomInfoT;
}

export type PassportArray = Passport[];

export type Passport = {
  __typename: string;
  node: PassportNode;
};

export type TasksArray = Task[];

export type TaskNode = {
  __typename: string;
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  description: string;
  updated_at?: string;
  due_date?: string;
  priority?: string;
  assigned_to?: string;
  label?: string[];
  completed_at?: string;
  is_archived?: boolean;
  status: TaskStatus;
  order: number;
  background: string;
  colors: string[][];
  type: string;
  workspace_id: string;
  cost: string;
  is_public: boolean;
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

export type CardRoomT = {
  node: RoomNode;
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

export type RoomInfoT = {
  __typename: string;
  chat_id: string;
  name: string;
  type: string;
  codes: string;
};

export interface RoomNode {
  __typename: "rooms";
  id: number;
  created_at: string;
  updated_at?: string | null;
  workspace_id?: string | null;
  type: string;
  id_additional?: string | null;
  name: string;
  enabled?: boolean | null;
  description?: string | null;
  customer_id?: string | null;
  app_id?: string | null;
  recording_info?: string;
  template_id?: string | null;
  template?: string | null;
  region?: string | null;
  customer?: string | null;
  large_room?: boolean | null;
  codes: string;
  type_additional?: string | null;
  user_id?: string | null;
  room_id: string;
  language_code: string | null;
  chat_id: string;
  token?: string | null;
  username: string;
  original_name?: string | null;
  public?: boolean | null;
  rooms?: RoomInfoT;
}

export type TaskNodeType = {
  id: string;
  user_id: string;
  workspace_id: string;
  room_id: string;
  recording_id: string;
  created_at: string;
  title: string;
  description: string;
  is_public: boolean;
  cost: string;
  updated_at: string;
  due_date: string | null;
  priority: string;
  completed_at: string | null;
  is_archived: boolean;
  status: string;
  label: string;
  assigned_to: string;
};

export interface RowTaskType {
  __typename: string;
  original: {
    node: TaskNodeType;
  };
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

export interface CreateUserProps {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_bot?: boolean;
  language_code?: string;
  chat_id?: number;
  inviter: string;
  invitation_codes: string;
  telegram_id?: number;
  email?: string;
  photo_url?: string;
}
