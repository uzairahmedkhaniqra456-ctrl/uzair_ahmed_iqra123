import pandas as pd
from rag_engine import load_rag_components
# Load RAG components
retriever, llm = load_rag_components()
# Load datasets
students_df = pd.read_csv("../data/students.csv")
enroll_df = pd.read_csv("../data/student_course_enrollment.csv")
# Session variables
current_student_id = None
current_student_semester = None
print("🎓 University Campus Chatbot Started")
# Chat Loop
while True:
    query = input("\nAsk a campus question (or type exit): ").strip()
    if query.lower() == "exit":
        print("Goodbye 👋")
        break

    q = query.lower()
    # 1️⃣ AUTHENTICATION — REGISTRATION NUMBE
    if "registration" in q:
        reg_no = "".join(filter(str.isdigit, query))

        student = students_df[
            students_df["registration_no"].astype(str) == reg_no
        ]

        if not student.empty:
            current_student_id = student.iloc[0]["student_id"]
            current_student_semester = int(student.iloc[0]["semester"])

            print(
                f"\nAnswer:\n Welcome {student.iloc[0]['student_name']}!"
                f"\nSemester: {current_student_semester}"
            )
            print("You are now authenticated. You can ask about your courses, timetable, or fees.")
        else:
            print("\nAnswer:\n Registration number not found.")

        continue  # 🔒 stop further processing
    # 2️⃣ PERSONAL QUERY — MY COURSES (NO RAG)
    if any(x in q for x in ["my course", "my courses", "my subject", "my subjects"]):
        if current_student_id is None:
            print("\nAnswer:\n Please enter your registration number first.")
        else:
            courses = enroll_df[
                (enroll_df["student_id"] == current_student_id) &
                (enroll_df["semester"] == current_student_semester)
            ]

            if courses.empty:
                print(
                    f"\nAnswer:\n Your enrollment data for Semester "
                    f"{current_student_semester} is not available. "
                    "Please contact academic affairs."
                )
            else:
                subject_list = courses["subject_code"].unique().tolist()
                print("\nAnswer:\n You are enrolled in the following courses:")
                for s in subject_list:
                    print("-", s)
                print("Total courses:", len(subject_list))

        continue  # 🚨 NEVER let RAG answer this
    # 3️⃣ GENERAL UNIVERSITY QUESTIONS — RAG
    docs = retriever.invoke(query)
    context = "\n".join([doc.page_content for doc in docs])

    prompt = f"""
You are a university campus assistant chatbot.
Answer ONLY from the context below.

Context:
{context}

Question:
{query}

Answer:
"""

    response = llm.invoke(prompt)
    print("\nAnswer:\n", response.content)
