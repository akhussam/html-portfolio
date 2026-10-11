"""LearningEngineService implementation (contract: packages/contracts/proto/engine/v1/engine.proto).

Every RPC answers UNIMPLEMENTED (the generated default) until step 1.4 adds BKT.
"""

from engine.v1.engine_connect import LearningEngineService


class LearningEngine(LearningEngineService):
    pass
