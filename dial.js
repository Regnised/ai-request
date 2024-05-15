import {AzureOpenAI} from "openai";

const client = new AzureOpenAI({
    apiKey: process.env.EPAM_DIAL_KEY,
    endpoint: process.env.EPAM_DIAL_ENDPOINT,
    apiVersion: process.env.EPAM_DIAL_VERSION
});

const askForHelp = async () => {
    const completion = await client.chat.completions.create({
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
        model: "gpt-35-turbo"
    });

    console.log(completion.choices[0]);
}

askForHelp().then(console.log);

