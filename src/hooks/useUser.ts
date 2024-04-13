const useUser = () => {
  const username = localStorage.getItem("username") || "";
  const user_id = localStorage.getItem("user_id") || "";
  const workspace_id = localStorage.getItem("workspace_id") || "";
  const workspace_name = localStorage.getItem("workspace_name") || "";
  const room_id = localStorage.getItem("room_id") || "";
  const room_name = localStorage.getItem("room_name") || "";
  const recording_id = localStorage.getItem("recording_id") || "";
  const photo_url = localStorage.getItem("photo_url") || "";
  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");

  return {
    username,
    user_id,
    workspace_id,
    workspace_name,
    room_id,
    room_name,
    recording_id,
    photo_url,
    firstName,
    lastName,
  };
};

export { useUser };
