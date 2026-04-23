import { hashingData } from "@common/index";
import { CreateAuthDto } from "../dto/create-auth.dto";
import { Auth } from "../entities/auth.entity.js";

export class AuthFactory {
    constructor() {}
    async register(createAuthDto: CreateAuthDto) {
        const user = new Auth();

        user.userName = createAuthDto.userName;
        user.email = createAuthDto.email;
        user.password = await hashingData(createAuthDto.password);

        return user;
    }
}
