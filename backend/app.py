from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from rag_engine import load_rag_components
from routes.auth import router as auth_router


app = FastAPI(title="Campus RAG Chatbot API")
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later restrict if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Load RAG
# =========================
retriever, llm = load_rag_components()

# =========================
# Load datasets
# =========================
students_df = pd.read_csv("data/students.csv")
enroll_df = pd.read_csv("data/student_course_enrollment.csv")

# =========================
# Session memory (demo-level)
# =========================
current_session = {
    "student_id": None,
    "semester": None,
    "student_name": None
}

# =========================
# Request / Response Models
# =========================
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str


# =========================
# Chat Endpoint
# =========================
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    query = req.message.strip()
    q = query.lower()

    # -------------------------------------------------
    # 1️⃣ AUTHENTICATION (Registration Number)
    # -------------------------------------------------
    if "registration" in q:
        reg_no = "".join(filter(str.isdigit, query))
        student = students_df[
            students_df["registration_no"].astype(str) == reg_no
        ]

        if not student.empty:
            current_session["student_id"] = student.iloc[0]["student_id"]
            current_session["semester"] = int(student.iloc[0]["semester"])
            current_session["student_name"] = student.iloc[0]["student_name"]

            return {
                "response": (
                    f"Welcome {current_session['student_name']}!\n"
                    f"You are authenticated for Semester {current_session['semester']}.\n"
                    "You can now ask about your courses, timetable, or fees."
                )
            }

        return {"response": "Registration number not found. Please try again."}

    # -------------------------------------------------
    # 2️⃣ MY COURSES (STRICT — NO RAG)
    # -------------------------------------------------
    if any(x in q for x in ["my course", "my courses", "my subject", "my subjects"]):
        if current_session["student_id"] is None:
            return {"response": "Please enter your registration number first."}

        courses = enroll_df[
            (enroll_df["student_id"] == current_session["student_id"]) &
            (enroll_df["semester"] == current_session["semester"])
        ]

        if courses.empty:
            return {
                "response": (
                    f"Your enrollment data for Semester "
                    f"{current_session['semester']} is not available. "
                    "Please contact academic affairs."
                )
            }

        subject_list = courses["subject_code"].unique().tolist()

        response_text = "You are enrolled in the following courses:\n"
        for s in subject_list:
            response_text += f"- {s}\n"
        response_text += f"Total courses: {len(subject_list)}"

        return {"response": response_text}

    # -------------------------------------------------
    # 3️⃣ GENERAL CAMPUS QUESTIONS (RAG)
    # -------------------------------------------------
    docs = retriever.invoke(query)
    context = "\n".join([doc.page_content for doc in docs])

    prompt = f"""
You are a university campus assistant chatbot.
Answer ONLY from the context below.
Do NOT guess or add new information.

Context:
{context}

Question:
{query}

Answer:
"""

    response = llm.invoke(prompt)
    return {"response": response.content}
