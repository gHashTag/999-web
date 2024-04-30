interface PathDecrementContext {
  path: string;
  biggestSubtopic: number;
}

function pathDecrement({ path, biggestSubtopic }: PathDecrementContext) {
  const [language, lessonStr, subtopicStr] = path.split("_");
  let lesson = parseInt(lessonStr, 10);
  let subtopic = parseInt(subtopicStr, 10);

  // Уменьшаем сабтопик
  subtopic -= 1;

  // Если сабтопик меньше 1, уменьшаем номер урока и устанавливаем максимальный сабтопик для предыдущего урока
  if (subtopic < 1) {
    lesson -= 1;
    subtopic = biggestSubtopic;
  }

  // Формируем и возвращаем новый путь
  return `${language}_${lesson.toString().padStart(2, "0")}_${
    subtopic.toString().padStart(2, "0")
  }`;
}

export { pathDecrement };
