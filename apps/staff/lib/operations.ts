import { graphql } from "../gql";

// Operations used by the panels. Each is validated against the contract schema at codegen time.

export const RoomGridQuery = graphql(`
  query RoomGrid($roomId: ID!) {
    room(roomId: $roomId) {
      id
      students {
        studentId
        displayName
        status
        currentSkillId
        productiveMinutesToday
      }
    }
  }
`);

export const RoomUpdatesSubscription = graphql(`
  subscription RoomUpdates($roomId: ID!) {
    roomUpdates(roomId: $roomId) {
      roomId
      at
      student {
        studentId
        status
        currentSkillId
        productiveMinutesToday
      }
    }
  }
`);

export const WeeklyReportQuery = graphql(`
  query WeeklyReport($studentId: ID!) {
    weeklyReport(studentId: $studentId) {
      studentId
      weekStart
      productiveMinutes
      skillsMastered
    }
  }
`);

export const NudgeMutation = graphql(`
  mutation Nudge($studentId: ID!, $message: String!) {
    nudge(studentId: $studentId, message: $message)
  }
`);
