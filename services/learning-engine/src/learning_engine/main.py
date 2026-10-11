from fastapi import FastAPI

app = FastAPI(title="learning-engine")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
