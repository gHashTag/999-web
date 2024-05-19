export type TPeerMetadata = {
  displayName: string;
};

export interface SelectIzbushkaError {
  message: string;
  code?: string;
}

export interface SupabaseResponse<T> {
  data: T[] | null;
  error: SelectIzbushkaError | null;
}
