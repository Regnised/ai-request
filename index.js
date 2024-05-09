import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import {Uploadable} from "openai/src/core";
const openai = new OpenAI({apiKey: ""});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main() {

    const assistant = await openai.beta.assistants.create({
        name: "Assistant",
        instructions: `You are an experienced information technologies assistant. Use you knowledge base to answer
        questions about audited financial statements.`,
        model: "gpt-4-turbo",
        tools: [{ type: "file_search" }],
    });

    const fileStreams = ['cv-improver.pdf', "test.txt"].map((path) =>
        fs.createReadStream(path),
    );
    const test = { files: fileStreams, fileIds: [] };
    // const fileStreams = [fs.createReadStream(path.join(__dirname,'cv-improver.pdf'))];

// Create a vector store including our two files.
    let vectorStore = await openai.beta.vectorStores.create({
        name: "Curriculum vitae improvement document",
    });

    console.log(`VectorStore`)
    console.log(vectorStore)

    await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams)

    await openai.beta.assistants.update(assistant.id, {
        tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
    });

    console.log(`Assistant id: ${assistant.id}`)

    console.log(`vectorStore id : ${vectorStore.id}`)
}

main();
