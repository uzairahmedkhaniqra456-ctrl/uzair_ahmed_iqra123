import pandas as pd
from langchain_core.documents import Document

CSV_FILES = [
    "students.csv",
    "subjects.csv",
    "faculty.csv",
    "classrooms.csv",
    "timetable.csv",
    "fees_rules.csv",
    "student_course_enrollment.csv"
]

def load_documents(data_path="../data"):
    documents = []

    for file in CSV_FILES:
        df = pd.read_csv(f"{data_path}/{file}")

        for _, row in df.iterrows():
            content = f"{file} | " + " | ".join(
                [f"{col}: {row[col]}" for col in df.columns]
            )

            documents.append(
                Document(
                    page_content=content,
                    metadata={"source": file}
                )
            )

    return documents
