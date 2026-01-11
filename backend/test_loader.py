from data_loader import load_documents

docs = load_documents()
print("Total documents:", len(docs))
print(docs[0].page_content)
