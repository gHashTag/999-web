export async function readStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return new TextDecoder().decode(concatenateUint8Arrays(chunks));
}

// Функция для конкатенации массивов Uint8Array
function concatenateUint8Arrays(arrays: Uint8Array[]) {
  const totalLength = arrays.reduce((sum, value) => sum + value.length, 0);
  const result = new Uint8Array(totalLength);
  let length = 0;

  for (let array of arrays) {
    result.set(array, length);
    length += array.length;
  }

  return result;
}
