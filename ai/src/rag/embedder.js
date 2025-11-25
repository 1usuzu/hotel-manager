// ai/src/rag/embedder.js
import { pipeline } from '@xenova/transformers';

let embedder = null;

async function loadEmbedder() {
  if (!embedder) {
    console.log('[ai] Đang load BGE embedder (Xenova/bge-base-en-v1.5)...');
    // Dùng bản đã được Xenova convert, có ONNX sẵn
    embedder = await pipeline('feature-extraction', 'Xenova/bge-base-en-v1.5');
    console.log('[ai] Load BGE xong');
  }
  return embedder;
}

export async function embedText(text) {
  if (!text || !text.trim()) return [];

  const model = await loadEmbedder();

  const output = await model(text, {
    pooling: 'mean',
    normalize: true
  });

  return Array.from(output.data); // Float32Array -> Array<number>
}
