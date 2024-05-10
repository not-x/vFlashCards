// import { ChatOpenAI } from "@langchain/openai";
// import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
// import { PPTXLoader } from "langchain/document_loaders/fs/pptx";
// import { DocxLoader } from "langchain/document_loaders/fs/docx";
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
// import { createRetrievalChain } from "langchain/chains/retrieval";

const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate, PromptTemplate } = require("@langchain/core/prompts");
const { PPTXLoader } = require("langchain/document_loaders/fs/pptx");
const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");

async function quesAnsGenerator(file, apiKey, fileType) {
    try {
        const chatModel = new ChatOpenAI({
            openAIApiKey: apiKey,
            temperature: 0.0,
        });

        // const inputDocument = file;
        // const loader = new PPTXLoader(inputDocument);
        let loader;
        if (fileType === "txt") {
            loader = new TextLoader(file);
        } else if (fileType === "pdf") {
            loader = new PDFLoader(file);
        } else if (fileType === "ms-word") {
            loader = new DocxLoader(file);
        } else if (fileType === "ms-ppt") {
            loader = new PPTXLoader(file);
        }

        const docs = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter();
        const splitDocs = await splitter.splitDocuments(docs);

        const embeddings = new OpenAIEmbeddings();
        const vectorstores = await MemoryVectorStore.fromDocuments(
            splitDocs,
            embeddings
        );

        const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

        <context>
        {context}
        </context>

        Question: {input}`);

        const documentChain = await createStuffDocumentsChain({
            llm: chatModel,
            prompt,
        });

        const getDetail = "You are a helpful AI assistant. List up to 100 detail from the document and do not leave out anything."

        const retriever = vectorstores.asRetriever();
        const retrievalChain = await createRetrievalChain({
            combineDocsChain: documentChain,
            retriever,
        });
        const detailResult = await retrievalChain.invoke({
            input: getDetail,
        });

        const questionPrompt = PromptTemplate.fromTemplate(
            `Generate a list of questions from the list of {detail}.`
        );

        const questionChain = questionPrompt.pipe(chatModel);
        const getQuestions = await questionChain.invoke({ detail: detailResult.answer });
        let getAns = "";
        let isValid = false;
        while (!isValid) {
            getAns = await retrievalChain.invoke({
                input: getQuestions.content,
            });
            if (getQuestions.length === getAns.length) isValid = true;
        }

        let quesArr = getQuestions.content.split('\n');
        quesArr = quesArr.map(line => line.replace(/^\d+\.\s/, ''));
        let ansArr = getAns.answer.split('\n');
        ans = ans.map(line => line.replace(/^\d+\.\s/, ''));

        const quesAnsList = [];
        for (let i = 0; i < ans.length; i++) {
            quesAnsList.push([quesArr[i], ansArr[i]]);
        }

        return quesAnsList;
    } catch (err) {
        console.error("Error - " + err);
        res.send("Error - " + err);
    }
}

module.exports = quesAnsGenerator;