import { supabase } from "../../../utils/supabase";

async function getBiggest(lesson_number: number): Promise<number | null> {

  const { data, error } = await supabase
    .from("javascript")
    .select("subtopic")
    .eq("lesson_number", lesson_number)
    .order("subtopic", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  const result = data.length > 0 ? data[0].subtopic : null;
  return result;
}

export { getBiggest };
