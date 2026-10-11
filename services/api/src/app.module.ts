import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller.js";
import { IdentityModule } from "./modules/identity/index.js";
import { RosterModule } from "./modules/roster/index.js";
import { ContentModule } from "./modules/content/index.js";
import { AssessmentModule } from "./modules/assessment/index.js";
import { SessionModule } from "./modules/session/index.js";
import { GamificationModule } from "./modules/gamification/index.js";
import { NotificationModule } from "./modules/notification/index.js";
import { ReportingModule } from "./modules/reporting/index.js";

// Modular monolith (ADR-001): one Nest module per architecture module (plan §4).
@Module({
  imports: [
    IdentityModule,
    RosterModule,
    ContentModule,
    AssessmentModule,
    SessionModule,
    GamificationModule,
    NotificationModule,
    ReportingModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
