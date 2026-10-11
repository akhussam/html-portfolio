"""Contract test: the engine serves all three RPCs from engine.proto over Connect."""

import socket
import threading
import time
from collections.abc import Iterator
from typing import Any

import pytest
import uvicorn
from connectrpc.code import Code
from connectrpc.errors import ConnectError
from connectrpc.request import RequestContext
from engine.v1 import engine_pb2
from engine.v1.engine_connect import (
    LearningEngineServiceASGIApplication,
    LearningEngineServiceClientSync,
)

from learning_engine.main import app


@pytest.fixture(scope="module")
def base_url() -> Iterator[str]:
    yield from _serve(app)


def _serve(asgi_app: Any) -> Iterator[str]:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        port = s.getsockname()[1]
    server = uvicorn.Server(
        uvicorn.Config(asgi_app, host="127.0.0.1", port=port, log_level="warning")
    )
    thread = threading.Thread(target=server.run, daemon=True)
    thread.start()
    while not server.started:
        time.sleep(0.01)
    yield f"http://127.0.0.1:{port}"
    server.should_exit = True
    thread.join()


TENANT = "00000000-0000-4000-8000-000000000001"
STUDENT = "00000000-0000-4000-8000-000000000002"

CALLS = [
    (
        "update_mastery",
        engine_pb2.UpdateMasteryRequest(
            tenant_id=TENANT, student_id=STUDENT, skill_id="s1", item_id="i1", correct=True
        ),
    ),
    (
        "recommend_next",
        engine_pb2.RecommendNextRequest(
            tenant_id=TENANT,
            student_id=STUDENT,
            skill_id="s1",
            candidates=[engine_pb2.CandidateItem(item_id="i1", skill_id="s1")],
        ),
    ),
    (
        "plan_day",
        engine_pb2.PlanDayRequest(tenant_id=TENANT, student_id=STUDENT, date="2026-10-11"),
    ),
]


@pytest.mark.parametrize(("method", "request_message"), CALLS, ids=[c[0] for c in CALLS])
def test_rpc_is_served(base_url: str, method: str, request_message: object) -> None:
    # Reaching the handler proves routing and serialization; the stub answers UNIMPLEMENTED.
    with LearningEngineServiceClientSync(base_url) as client:
        with pytest.raises(ConnectError) as err:
            getattr(client, method)(request_message)
    assert err.value.code == Code.UNIMPLEMENTED
    # A wrong route would also map to UNIMPLEMENTED (HTTP 404); this message comes from the handler.
    assert err.value.message == "Not implemented"


class EchoEngine:
    """Fake engine that answers from the request, to prove a full round trip."""

    async def update_mastery(
        self, request: engine_pb2.UpdateMasteryRequest, ctx: RequestContext[Any, Any]
    ) -> engine_pb2.UpdateMasteryResponse:
        return engine_pb2.UpdateMasteryResponse(skill_id=request.skill_id, p_mastery=0.5)

    async def recommend_next(
        self, request: engine_pb2.RecommendNextRequest, ctx: RequestContext[Any, Any]
    ) -> engine_pb2.RecommendNextResponse:
        first = request.candidates[0]
        return engine_pb2.RecommendNextResponse(
            item_id=first.item_id,
            skill_id=first.skill_id,
            reason=engine_pb2.RECOMMEND_REASON_PRACTICE,
        )

    async def plan_day(
        self, request: engine_pb2.PlanDayRequest, ctx: RequestContext[Any, Any]
    ) -> engine_pb2.PlanDayResponse:
        return engine_pb2.PlanDayResponse(
            goal_minutes=30, skills=[engine_pb2.PlannedSkill(skill_id="s1")]
        )


@pytest.fixture(scope="module")
def echo_url() -> Iterator[str]:
    yield from _serve(LearningEngineServiceASGIApplication(EchoEngine()))


def test_round_trip(echo_url: str) -> None:
    with LearningEngineServiceClientSync(echo_url) as client:
        mastery = client.update_mastery(CALLS[0][1])  # type: ignore[arg-type]
        nxt = client.recommend_next(CALLS[1][1])  # type: ignore[arg-type]
        plan = client.plan_day(CALLS[2][1])  # type: ignore[arg-type]
    assert (mastery.skill_id, mastery.p_mastery) == ("s1", 0.5)
    assert (nxt.item_id, nxt.reason) == ("i1", engine_pb2.RECOMMEND_REASON_PRACTICE)
    assert (plan.goal_minutes, [s.skill_id for s in plan.skills]) == (30, ["s1"])
