from engine.v1.engine_connect import LearningEngineServiceASGIApplication
from fastapi import FastAPI

from learning_engine.service import LearningEngine

app = FastAPI(title="learning-engine")

# Connect-RPC (ADR-004): serves gRPC and HTTP/JSON at /engine.v1.LearningEngineService/*
engine_rpc = LearningEngineServiceASGIApplication(LearningEngine())
app.mount(engine_rpc.path, engine_rpc)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
