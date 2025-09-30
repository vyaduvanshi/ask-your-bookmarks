// Cosine similarity helper
function cosineSim(a, b) {
  console.log('a')
  console.log(a.dims)
  console.log('b')
  console.log(b.dims)
  const dataA = a.data;
  const dataB = b.data;
  let dot = 0;
  for (let i = 0; i < dataA.length; i++) {
    dot += dataA[i] * dataB[i];
  }
  return dot; // since vectors are normalized, dot product == cosine similarity
}