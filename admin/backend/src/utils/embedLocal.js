const { pipeline } = require("@xenova/transformers");

let embedder;

// Khởi tạo model local
async function initEmbedder() {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2" // model embed miễn phí
    );
  }
}

async function createEmbedding(text) {
  await initEmbedder();

  const output = await embedder(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}

module.exports = { createEmbedding };
