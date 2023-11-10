"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWordDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_word_dto_1 = require("./create-word.dto");
class UpdateWordDto extends (0, mapped_types_1.PartialType)(create_word_dto_1.CreateWordDto) {
}
exports.UpdateWordDto = UpdateWordDto;
//# sourceMappingURL=update-word.dto.js.map