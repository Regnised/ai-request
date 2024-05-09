import OpenAI from "openai";
// import * as fs from "fs";

const openai = new OpenAI({apiKey: process.env.CHAT_GPT_API_KEY});


async function main() {

    const completion = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": "You are a helpful assistant."},
            { role: "user", content: "Please, improve my CV: Last two years, It was a great experience in a great" +
                    " company with good developers. It is a chance for my to investigate a new tech stacks, improve existed skills and make a significant contribution to the project.\n" +
                    "\n" +
                    "Working with AWS service, I find out that it is one of the best platforms to build the business and develop projects.\n" +
                    "\n" +
                    "I worked as Node.js back-end developer on the project. My responsibility was to support, create and update REST API. I created new lambda functions connected to API Gateway. All lambdas used express framework to handle API requests. One of my responsibility was fastify API endpoints deleting GraphQL DB mutation and queries to AWS DocumentClient batch requests.\n" +
                    "It was great experience to work with lambdas and AWS services. I worked in an international team.\n" +
                    "I would like to propose my expert javascript, typescript, Node.js and other skills for a new" +
                    " customer" }],
        model: "gpt-3.5-turbo"
    });

    console.log(completion.choices[0]);

    // const assistant = await openai.beta.assistants.create({
    //     name: "Assistant",
    //     instructions: `You are an experienced information technologies assistant.`,
    //     model: "gpt-4-turbo",
    //     // tools: [{ type: "file_search" }],
    // });

    // const fileStreams = ['cv-improver.pdf', "test.txt"].map((path) =>
    //     fs.createReadStream(path),
    // );
    // const fileStreams = [fs.createReadStream(path.join(__dirname,'cv-improver.pdf'))];

    // Create a vector store including our two files.
    //     let vectorStore = await openai.beta.vectorStores.create({
    //         name: "Curriculum vitae improvement document",
    //     });

    // await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams)

    // await openai.beta.assistants.update(assistant.id, {
    //     tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
    // });

    // console.log(`Assistant id: ${assistant.id}`)

    // console.log(`vectorStore id : ${vectorStore.id}`)
}

main().then(console.log);
