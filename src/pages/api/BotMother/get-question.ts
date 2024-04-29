import { supabase } from "../../../utils/supabase";

interface QuestionContext {
  lesson_number?: number;
  subtopic?: number;
}

async function getQuestion(ctx: QuestionContext) {
  // Проверяем, предоставлены ли lesson_number и subtopic
  if (ctx.lesson_number == null || ctx.subtopic == null) {
    console.error("getQuestion требует lesson_number и subtopic");
    return []; // Возвращаем пустой массив или выбрасываем ошибку
  }

  const { lesson_number, subtopic } = ctx;

  const { data, error } = await supabase
    .from("javascript")
    .select("*")
    .eq("lesson_number", lesson_number)
    .eq("subtopic", subtopic);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export { getQuestion };
