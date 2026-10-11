from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class RecommendReason(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    RECOMMEND_REASON_UNSPECIFIED: _ClassVar[RecommendReason]
    RECOMMEND_REASON_PRACTICE: _ClassVar[RecommendReason]
    RECOMMEND_REASON_PREREQUISITE_FALLBACK: _ClassVar[RecommendReason]
    RECOMMEND_REASON_READY_FOR_QUIZ: _ClassVar[RecommendReason]
RECOMMEND_REASON_UNSPECIFIED: RecommendReason
RECOMMEND_REASON_PRACTICE: RecommendReason
RECOMMEND_REASON_PREREQUISITE_FALLBACK: RecommendReason
RECOMMEND_REASON_READY_FOR_QUIZ: RecommendReason

class UpdateMasteryRequest(_message.Message):
    __slots__ = ("tenant_id", "student_id", "skill_id", "item_id", "correct", "hints_used")
    TENANT_ID_FIELD_NUMBER: _ClassVar[int]
    STUDENT_ID_FIELD_NUMBER: _ClassVar[int]
    SKILL_ID_FIELD_NUMBER: _ClassVar[int]
    ITEM_ID_FIELD_NUMBER: _ClassVar[int]
    CORRECT_FIELD_NUMBER: _ClassVar[int]
    HINTS_USED_FIELD_NUMBER: _ClassVar[int]
    tenant_id: str
    student_id: str
    skill_id: str
    item_id: str
    correct: bool
    hints_used: int
    def __init__(self, tenant_id: _Optional[str] = ..., student_id: _Optional[str] = ..., skill_id: _Optional[str] = ..., item_id: _Optional[str] = ..., correct: _Optional[bool] = ..., hints_used: _Optional[int] = ...) -> None: ...

class UpdateMasteryResponse(_message.Message):
    __slots__ = ("skill_id", "p_mastery")
    SKILL_ID_FIELD_NUMBER: _ClassVar[int]
    P_MASTERY_FIELD_NUMBER: _ClassVar[int]
    skill_id: str
    p_mastery: float
    def __init__(self, skill_id: _Optional[str] = ..., p_mastery: _Optional[float] = ...) -> None: ...

class CandidateItem(_message.Message):
    __slots__ = ("item_id", "skill_id")
    ITEM_ID_FIELD_NUMBER: _ClassVar[int]
    SKILL_ID_FIELD_NUMBER: _ClassVar[int]
    item_id: str
    skill_id: str
    def __init__(self, item_id: _Optional[str] = ..., skill_id: _Optional[str] = ...) -> None: ...

class RecommendNextRequest(_message.Message):
    __slots__ = ("tenant_id", "student_id", "skill_id", "candidates", "prerequisite_skill_ids")
    TENANT_ID_FIELD_NUMBER: _ClassVar[int]
    STUDENT_ID_FIELD_NUMBER: _ClassVar[int]
    SKILL_ID_FIELD_NUMBER: _ClassVar[int]
    CANDIDATES_FIELD_NUMBER: _ClassVar[int]
    PREREQUISITE_SKILL_IDS_FIELD_NUMBER: _ClassVar[int]
    tenant_id: str
    student_id: str
    skill_id: str
    candidates: _containers.RepeatedCompositeFieldContainer[CandidateItem]
    prerequisite_skill_ids: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, tenant_id: _Optional[str] = ..., student_id: _Optional[str] = ..., skill_id: _Optional[str] = ..., candidates: _Optional[_Iterable[_Union[CandidateItem, _Mapping]]] = ..., prerequisite_skill_ids: _Optional[_Iterable[str]] = ...) -> None: ...

class RecommendNextResponse(_message.Message):
    __slots__ = ("item_id", "skill_id", "reason")
    ITEM_ID_FIELD_NUMBER: _ClassVar[int]
    SKILL_ID_FIELD_NUMBER: _ClassVar[int]
    REASON_FIELD_NUMBER: _ClassVar[int]
    item_id: str
    skill_id: str
    reason: RecommendReason
    def __init__(self, item_id: _Optional[str] = ..., skill_id: _Optional[str] = ..., reason: _Optional[_Union[RecommendReason, str]] = ...) -> None: ...

class PlanDayRequest(_message.Message):
    __slots__ = ("tenant_id", "student_id", "date")
    TENANT_ID_FIELD_NUMBER: _ClassVar[int]
    STUDENT_ID_FIELD_NUMBER: _ClassVar[int]
    DATE_FIELD_NUMBER: _ClassVar[int]
    tenant_id: str
    student_id: str
    date: str
    def __init__(self, tenant_id: _Optional[str] = ..., student_id: _Optional[str] = ..., date: _Optional[str] = ...) -> None: ...

class PlannedSkill(_message.Message):
    __slots__ = ("skill_id",)
    SKILL_ID_FIELD_NUMBER: _ClassVar[int]
    skill_id: str
    def __init__(self, skill_id: _Optional[str] = ...) -> None: ...

class PlanDayResponse(_message.Message):
    __slots__ = ("goal_minutes", "skills")
    GOAL_MINUTES_FIELD_NUMBER: _ClassVar[int]
    SKILLS_FIELD_NUMBER: _ClassVar[int]
    goal_minutes: int
    skills: _containers.RepeatedCompositeFieldContainer[PlannedSkill]
    def __init__(self, goal_minutes: _Optional[int] = ..., skills: _Optional[_Iterable[_Union[PlannedSkill, _Mapping]]] = ...) -> None: ...
