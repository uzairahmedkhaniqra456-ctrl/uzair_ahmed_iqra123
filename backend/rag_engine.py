from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI

VECTOR_PATH = "../vector_store/campus_faiss"

def load_rag_components():
    # Embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    # Load vector store
    vectorstore = FAISS.load_local(
        VECTOR_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )

    # Retriever
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    # LLM
    llm = ChatOpenAI(
        temperature=0,
        model="gpt-4o-mini"
    )

    return retriever, llm
