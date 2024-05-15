import OpenAI from "openai";
import * as fs from "fs";

const openai = new OpenAI({apiKey: process.env.CHAT_GPT_API_KEY});

/*const askForHelp = async () => {
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
}*/
const askForImprovement = async (assistant) => {
    const run = await openai.beta.threads.runs.create(
        'thread_ne6qldVJtQZcfhOIt42XleGz',
        {
            assistant_id: 'asst_nVkjuOcWeEXWmtCoqjPUORr1',
            additional_messages: [
                {
                role: "user",
                    content: `Could you please sort the projects by the date from new to old and show me the ordered
list of this dates? Also for each project find: Customer, Customer Description, Project Description, 
Team Size, Project Roles, Responsibilities, Tools and Technologies information. Take 
recommendations from recommendations.md file, then 
find in kb.md file descriptions for that recommendations and improve the CV text from soft-dev.docx.
If you need to improve the description then write at least 100 words`
                }
            ]
        }

    );

    /**
     *   "id": "run_abc123",
     *   "object": "thread.run",
     *   "created_at": 1699063290,
     *   "assistant_id": "asst_abc123",
     *   "thread_id": "thread_abc123",
     *   "status": "queued",
     *   "started_at": 1699063290,
     *   "expires_at": null,
     *   "cancelled_at": null,
     *   "failed_at": null,
     *   "completed_at": 1699063291,
     *   "last_error": null,
     *   "model": "gpt-4-turbo",
     *   "instructions": null,
     *   "incomplete_details": null,
     *   "tools": [
     *     {
     *       "type": "code_interpreter"
     *     }
     *   ],
     *   "metadata": {},
     *   "usage": null,
     *   "temperature": 1.0,
     *   "top_p": 1.0,
     *   "max_prompt_tokens": 1000,
     *   "max_completion_tokens": 1000,
     *   "truncation_strategy": {
     *     "type": "auto",
     *     "last_messages": null
     *   },
     *   "response_format": "auto",
     *   "tool_choice": "auto"
     */
    console.log('Run');
    console.log(run);
}

async function init() {
    const assistant = await openai.beta.assistants.create({
        name: "Assistant",
        instructions: `You are an experienced information technologies assistant.`,
        model: "gpt-4-turbo",
        tools: [{ type: "file_search" }],
    });

    const fileStreams = ['files/kb.md', "files/recommendations.md", "files/soft-dev.docx"].map((path) =>
        fs.createReadStream(path),
    );

    const kbFile = await openai.files.create({
        file: fs.createReadStream("files/kb.md"),
        purpose: "assistants",
    });
    console.log('kb');
    console.log(kbFile);

    const recommendationsFile = await openai.files.create({
        file: fs.createReadStream("files/soft-dev.docx"),
        purpose: "assistants",
    });
    console.log('recommendations');
    console.log(recommendationsFile);

    const cvFile = await openai.files.create({
        file: fs.createReadStream("files/recommendations.md"),
        purpose: "assistants",
    });
    console.log('CV:')
    console.log(cvFile);

    // Create a vector store including our files.
    let vectorStore = await openai.beta.vectorStores.create({
        name: "Knowledge base. CV recommendations. CV",
    });

    console.log('vectorStorevectorStore')
    console.log(vectorStore)
    // await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {files: [fileStreams]})

    const myVectorStoreFileBatch = await openai.beta.vectorStores.fileBatches.create(
        vectorStore.id,
        {
            file_ids: [kbFile.id, recommendationsFile.id, cvFile.id]
        }
    );
    console.log(myVectorStoreFileBatch);

    await openai.beta.assistants.update(assistant.id, {
        tool_resources: { file_search: { vector_store_ids: [myVectorStoreFileBatch.vector_store_id] } },
    });

    console.log(`Assistant id: ${assistant.id}`)
    console.log(`vectorStore id : ${myVectorStoreFileBatch.id}`);
}

const checkResult = async (threadId, runId) => {
    const runResult = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
    );

    console.log('RunResult:');
    console.log(runResult);

    const messages = await openai.beta.threads.messages.list(
        threadId
    )
    console.log('Messages');
    console.log(messages.data[0].content);
}

// init().then(console.log);
// askForImprovement().then(console.log);
checkResult('thread_ne6qldVJtQZcfhOIt42XleGz', 'run_vHLk6GeafMQnEJr6PGn9vGXJ').then(console.log);
