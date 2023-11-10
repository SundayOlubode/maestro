"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../user/entities/user.entity");
class LoginDto extends (0, swagger_1.PartialType)((0, swagger_1.PickType)(user_entity_1.User, ["email", "password"])) {
}
exports.LoginDto = LoginDto;
//# sourceMappingURL=create-auth.dto.js.map