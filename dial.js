import { AzureOpenAI } from "openai";
import fs from "fs";

const client = new AzureOpenAI({
  apiKey: process.env.EPAM_DIAL_KEY,
  endpoint: process.env.EPAM_DIAL_ENDPOINT,
  apiVersion: process.env.EPAM_DIAL_VERSION,
});

const askForHelp = async () => {
  const completion = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: "can you remember some text for me?",
      },
    ],
    model: "gpt-35-turbo",
  });

  console.log(completion.choices[0]);
};

async function init() {
  const assistant = await client.beta.assistants.create({
    name: "Assistant",
    instructions: `You are an experienced information technologies assistant. You need to improve developer CV`,
    model: "gpt-3.5",
    tools: [{ type: "file_search" }],
  });

  console.log("Assistant");
  console.log(assistant);

  const fileStreams = [
    "files/kb.md",
    "files/recommendations.md",
    "files/soft-dev.docx",
  ].map((path) => fs.createReadStream(path));

  const kbFile = await client.files.create({
    file: fs.createReadStream("files/kb.md"),
    purpose: "assistants",
  });
  console.log("kb");
  console.log(kbFile);

  const recommendationsFile = await client.files.create({
    file: fs.createReadStream("files/soft-dev.docx"),
    purpose: "assistants",
  });
  console.log("recommendations");
  console.log(recommendationsFile);

  const cvFile = await client.files.create({
    file: fs.createReadStream("files/recommendations.md"),
    purpose: "assistants",
  });
  console.log("CV:");
  console.log(cvFile);

  // Create a vector store including our files.
  let vectorStore = await client.beta.vectorStores.create({
    name: "Knowledge base. CV recommendations. CV",
  });

  console.log("vectorStore");
  console.log(vectorStore);
  // await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {files: [fileStreams]})

  const myVectorStoreFileBatch =
    await client.beta.vectorStores.fileBatches.create(vectorStore.id, {
      file_ids: [kbFile.id, recommendationsFile.id, cvFile.id],
    });
  console.log(myVectorStoreFileBatch);

  await client.beta.assistants.update(assistant.id, {
    tool_resources: {
      file_search: {
        vector_store_ids: [myVectorStoreFileBatch.vector_store_id],
      },
    },
  });

  console.log(`Assistant id: ${assistant.id}`);
  console.log(`vectorStore id : ${myVectorStoreFileBatch.id}`);
}

// init().then(console.log);
askForHelp().then(console.log);
