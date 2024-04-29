import { supabase } from "../../../utils/supabase";

interface updateProgressContext {
  user_id: string;
  isTrue: boolean;
  path: string;
}

async function updateProgress(
  { user_id, isTrue, path }: updateProgressContext,
): Promise<void> {
  const { data: progressData, error: progressError } = await supabase
    .from("javascript_progress")
    .select("user_id")
    .eq("user_id", user_id);

  if (progressError) throw new Error(progressError.message);

  if (progressData && progressData.length === 0) {
    const { error: insertError } = await supabase
      .from("javascript_progress")
      .insert([{ user_id: user_id }]);

    if (insertError) throw new Error(insertError.message);
  } else {
    const { error: updateError } = await supabase
      .from("javascript_progress")
      .update({ [path]: isTrue })
      .eq("user_id", user_id);

    if (updateError) throw new Error(updateError.message);
  }
}

export { updateProgress };
