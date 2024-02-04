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
exports.ExceptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ExceptionService = class ExceptionService {
    constructor() {
        this.configService = new config_1.ConfigService();
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const message = exception.getResponse();
        if (this.configService.get('NODE_ENV') === 'development') {
            console.log(exception);
            response.status(status).json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message,
            });
        }
        else if (this.configService.get('NODE_ENV') === 'production') {
            response.status(status).json({
                statusCode: status,
                message,
            });
        }
    }
};
exports.ExceptionService = ExceptionService;
exports.ExceptionService = ExceptionService = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    __metadata("design:paramtypes", [])
], ExceptionService);
//# sourceMappingURL=exception.service.js.map