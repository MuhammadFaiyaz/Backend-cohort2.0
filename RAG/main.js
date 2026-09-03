import fs from "fs"
import { PDFParse } from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai"
import { config } from "dotenv";

import { Pinecone } from '@pinecone-database/pinecone'
import { text } from "stream/consumers";


config()

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index("cohort-2-rag")

// const dataBuffer = fs.readFileSync('./From_Student_Coder_to_Software_Engineer.pdf');

// const parser = new PDFParse({ data: dataBuffer })

const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed"
})
// const data = await parser.getText()


// const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 900,
//     chunkOverlap: 0,
// })

// const chunks = await splitter.splitText(data.text)

// const docs = await Promise.all(chunks.map(async (chunk) => {
//     const embedding = await embeddings.embedQuery(chunk)
//     return {
//         text: chunk,
//         embedding
//     }
// }))

// const result = await index.upsert({
//     records: docs.map((doc, i)=>({
//         id: `doc-${i}`,
//         values: doc.embedding,
//         metadata: {text: doc.text}
//     }))
// })

// console.log(result);

const queryEmbeding = await embeddings.embedQuery("Tell me the first mistakes of Arif?")

console.log(queryEmbeding);

const result = await index.query({
    vector: queryEmbeding,
    topK: 2,
    includeMetadata: true
})
console.log(JSON.stringify(result));
