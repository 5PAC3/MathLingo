from fastapi import FastAPI

app = FastAPI(title="MathLingo API")

@app.get("/")
def root():
    return {"message": "MathLingo API"}
