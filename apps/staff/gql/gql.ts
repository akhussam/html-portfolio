/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query RoomGrid($roomId: ID!) {\n    room(roomId: $roomId) {\n      id\n      students {\n        studentId\n        displayName\n        status\n        currentSkillId\n        productiveMinutesToday\n      }\n    }\n  }\n": typeof types.RoomGridDocument,
    "\n  subscription RoomUpdates($roomId: ID!) {\n    roomUpdates(roomId: $roomId) {\n      roomId\n      at\n      student {\n        studentId\n        status\n        currentSkillId\n        productiveMinutesToday\n      }\n    }\n  }\n": typeof types.RoomUpdatesDocument,
    "\n  query WeeklyReport($studentId: ID!) {\n    weeklyReport(studentId: $studentId) {\n      studentId\n      weekStart\n      productiveMinutes\n      skillsMastered\n    }\n  }\n": typeof types.WeeklyReportDocument,
    "\n  mutation Nudge($studentId: ID!, $message: String!) {\n    nudge(studentId: $studentId, message: $message)\n  }\n": typeof types.NudgeDocument,
};
const documents: Documents = {
    "\n  query RoomGrid($roomId: ID!) {\n    room(roomId: $roomId) {\n      id\n      students {\n        studentId\n        displayName\n        status\n        currentSkillId\n        productiveMinutesToday\n      }\n    }\n  }\n": types.RoomGridDocument,
    "\n  subscription RoomUpdates($roomId: ID!) {\n    roomUpdates(roomId: $roomId) {\n      roomId\n      at\n      student {\n        studentId\n        status\n        currentSkillId\n        productiveMinutesToday\n      }\n    }\n  }\n": types.RoomUpdatesDocument,
    "\n  query WeeklyReport($studentId: ID!) {\n    weeklyReport(studentId: $studentId) {\n      studentId\n      weekStart\n      productiveMinutes\n      skillsMastered\n    }\n  }\n": types.WeeklyReportDocument,
    "\n  mutation Nudge($studentId: ID!, $message: String!) {\n    nudge(studentId: $studentId, message: $message)\n  }\n": types.NudgeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RoomGrid($roomId: ID!) {\n    room(roomId: $roomId) {\n      id\n      students {\n        studentId\n        displayName\n        status\n        currentSkillId\n        productiveMinutesToday\n      }\n    }\n  }\n"): (typeof documents)["\n  query RoomGrid($roomId: ID!) {\n    room(roomId: $roomId) {\n      id\n      students {\n        studentId\n        displayName\n        status\n        currentSkillId\n        productiveMinutesToday\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription RoomUpdates($roomId: ID!) {\n    roomUpdates(roomId: $roomId) {\n      roomId\n      at\n      student {\n        studentId\n        status\n        currentSkillId\n        productiveMinutesToday\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription RoomUpdates($roomId: ID!) {\n    roomUpdates(roomId: $roomId) {\n      roomId\n      at\n      student {\n        studentId\n        status\n        currentSkillId\n        productiveMinutesToday\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query WeeklyReport($studentId: ID!) {\n    weeklyReport(studentId: $studentId) {\n      studentId\n      weekStart\n      productiveMinutes\n      skillsMastered\n    }\n  }\n"): (typeof documents)["\n  query WeeklyReport($studentId: ID!) {\n    weeklyReport(studentId: $studentId) {\n      studentId\n      weekStart\n      productiveMinutes\n      skillsMastered\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Nudge($studentId: ID!, $message: String!) {\n    nudge(studentId: $studentId, message: $message)\n  }\n"): (typeof documents)["\n  mutation Nudge($studentId: ID!, $message: String!) {\n    nudge(studentId: $studentId, message: $message)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;