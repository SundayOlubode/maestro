"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommonDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_common_dto_1 = require("./create-common.dto");
class UpdateCommonDto extends (0, mapped_types_1.PartialType)(create_common_dto_1.CreateCommonDto) {
}
exports.UpdateCommonDto = UpdateCommonDto;
//# sourceMappingURL=update-common.dto.js.map