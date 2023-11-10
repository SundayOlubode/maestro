"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaestroDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const add_word_dto_1 = require("./add-word.dto");
class UpdateMaestroDto extends (0, mapped_types_1.PartialType)(add_word_dto_1.AddWordDto) {
}
exports.UpdateMaestroDto = UpdateMaestroDto;
//# sourceMappingURL=update-maestro.dto.js.map