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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorController = void 0;
const common_1 = require("@nestjs/common");
const error_service_1 = require("./error.service");
let ErrorController = class ErrorController {
    constructor(errorService) {
        this.errorService = errorService;
    }
};
exports.ErrorController = ErrorController;
exports.ErrorController = ErrorController = __decorate([
    (0, common_1.Controller)('error'),
    __metadata("design:paramtypes", [error_service_1.ErrorService])
], ErrorController);
//# sourceMappingURL=error.controller.js.map