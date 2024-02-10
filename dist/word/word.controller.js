"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordController = void 0;
const common_1 = require("@nestjs/common");
const word_service_1 = require("./word.service");
const create_word_dto_1 = require("./dto/create-word.dto");
const update_word_dto_1 = require("./dto/update-word.dto");
const decorator_1 = require("../auth/decorator");
let WordController = class WordController {
    constructor(wordService) {
        this.wordService = wordService;
    }
    create(createWordDto, user) {
        return this.wordService.create(createWordDto, user);
    }
    findAll() {
        return this.wordService.findAll();
    }
    findOne(id) {
        return this.wordService.findOne(+id);
    }
    update(id, updateWordDto) {
        return this.wordService.update(+id, updateWordDto);
    }
    remove(id) {
        return this.wordService.remove(+id);
    }
};
exports.WordController = WordController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_word_dto_1.CreateWordDto, Object]),
    __metadata("design:returntype", void 0)
], WordController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WordController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WordController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_word_dto_1.UpdateWordDto]),
    __metadata("design:returntype", void 0)
], WordController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WordController.prototype, "remove", null);
exports.WordController = WordController = __decorate([
    (0, common_1.Controller)('word'),
    __metadata("design:paramtypes", [word_service_1.WordService])
], WordController);
//# sourceMappingURL=word.controller.js.map