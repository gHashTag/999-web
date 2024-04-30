interface PathContext {
  isSubtopic: boolean;
  path: string;
}

function pathIncrement(ctx: PathContext) {
  const { isSubtopic, path } = ctx;

  // Разбиваем путь на части
  const parts = path.split("_");
  let major = parseInt(parts[1], 10);
  let minor = parseInt(parts[2], 10);

  // Инкрементируем соответствующую часть
  if (isSubtopic) {
    minor += 1;
  } else {
    major += 1;
    minor = 1; // Сбрасываем минорную часть
  }

  // Формируем новый путь
  const newPath = `${parts[0]}_${major.toString().padStart(2, "0")}_${
    minor.toString().padStart(2, "0")
  }`;

  return newPath;
}

export { pathIncrement };
