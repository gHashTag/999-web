const usePath = (path: string) => {
  const splitPath = path?.split("/");

  const username = splitPath?.[1];
  const user_id = splitPath?.[2];
  const workspace_id = splitPath?.[3];
  const room_id = splitPath?.[4];
  const recording_id = splitPath?.[5];
  const task_id = splitPath?.[6];

  return { username, user_id, workspace_id, room_id, recording_id, task_id };
};

export { usePath };
