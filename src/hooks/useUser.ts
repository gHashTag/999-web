const useUser = () => {
  const username = localStorage.getItem("username") || "";
  const user_id = localStorage.getItem("user_id") || "";
  const workspace_id = localStorage.getItem("workspace_id") || "";
  const workspace_name = localStorage.getItem("workspace_name") || "";
  const workspace_type = localStorage.getItem("workspace_type");

  const header_name = localStorage.getItem("header_name") || "";
  const room_id = localStorage.getItem("room_id") || "";
  const room_name = localStorage.getItem("room_name") || "";
  const recording_id = localStorage.getItem("recording_id") || "";
  const recording_name = localStorage.getItem("recording_name") || "";
  const photo_url = localStorage.getItem("photo_url") || "";
  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");
  const lang = navigator.language.substring(0, 2);
  const owner = localStorage.getItem("is_owner");

  const is_owner = owner === "false" ? false : true;

  return {
    username,
    user_id,
    workspace_id,
    workspace_name,
    header_name,
    room_id,
    room_name,
    recording_id,
    recording_name,
    photo_url,
    firstName,
    lastName,
    lang,
    is_owner,
    workspace_type,
  };
};

export { useUser };
