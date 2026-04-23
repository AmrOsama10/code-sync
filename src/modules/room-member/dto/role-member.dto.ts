import { RoomMemberRole } from "@common/index";
import { IsEnum } from "class-validator";

export class RoleMemberDto {
    @IsEnum(RoomMemberRole)
    role: RoomMemberRole;
}
