import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { ManagerController } from "./manager.controller";
import { ManagerService } from "./manager.service";

@Module({
    imports: [AuthModule],
    controllers: [ManagerController],
    providers: [ManagerService],
    exports: [ManagerService],
})

export class ManagerModule {}