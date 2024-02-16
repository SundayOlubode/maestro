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
exports.WordService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const openai_service_1 = require("../openai/openai.service");
const config_1 = require("@nestjs/config");
const fs = require("fs");
const constants_1 = require("../constants");
let WordService = class WordService {
    constructor(db, openai, config) {
        this.db = db;
        this.openai = openai;
        this.config = config;
    }
    async create(dto, user) {
        let word = dto.word.toLowerCase();
        if (!constants_1.EnglishWords.check(word)) {
            throw new common_1.BadRequestException(`${word} is not a valid English word`);
        }
        const wordExists = await this.db.word.findFirst({
            where: {
                word,
            },
        });
        if (wordExists) {
            await this.updateWordUsersAndCounter(wordExists, user);
            return this.WordCreateResponse(word);
        }
        await this.generateWordMeaningAndUsages(word, user);
        return this.WordCreateResponse(word);
    }
    WordCreateResponse(word) {
        return {
            status: 'success',
            message: 'Word created successfully',
            data: {
                word,
            },
        };
    }
    async generateWordMeaningAndUsages(wordText, user) {
        const threadId = constants_1.DEV_THREAD_ID;
        await this.openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: wordText,
        });
        await this.openai.beta.threads.runs.create(threadId, {
            assistant_id: constants_1.DEV_ASST_ID,
        });
        const intervalId = setInterval(async () => {
            const response = await this.openai.beta.threads.messages.list(threadId);
            const lastMessage = response.data[0];
            const result = lastMessage.content[0]['text']['value'];
            if (result) {
                console.log('Result', result);
                fs.appendFileSync('word-meaning-and-usages.txt', result);
                const meaningRegex = /Meaning:(.*?)(?=Sentences:)/s;
                const usageRegex = /Sentences:(.*)/s;
                const sentenceRegex = /\d+\. "(.*?)"/g;
                const meaning = result.match(meaningRegex)[1].trim();
                const usageMatch = result.match(usageRegex)[1].trim();
                const usages = [];
                let match;
                while ((match = sentenceRegex.exec(usageMatch)) !== null) {
                    usages.push(match[1].trim());
                }
                const word = await this.db.word.create({
                    data: {
                        word: wordText,
                        meaning,
                        usages,
                        users: {
                            connect: {
                                id: user.id,
                            },
                        },
                    },
                });
                await this.db.counter.create({
                    data: {
                        user_id: user.id,
                        word_id: word.id,
                    },
                });
                clearInterval(intervalId);
            }
        }, 20000);
        return;
    }
    async updateWordUsersAndCounter(word, user) {
        await this.db.word.update({
            where: {
                id: word.id,
            },
            data: {
                users: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });
        await this.db.counter.create({
            data: {
                user_id: user.id,
                word_id: word.id,
            },
        });
        return;
    }
    findAll() {
        return `This action returns all word`;
    }
    findOne(id) {
        return `This action returns a #${id} word`;
    }
    update(id, updateWordDto) {
        return `This action updates a #${id} word`;
    }
    remove(id) {
        return `This action removes a #${id} word`;
    }
};
exports.WordService = WordService;
exports.WordService = WordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        openai_service_1.OpenaiService,
        config_1.ConfigService])
], WordService);
//# sourceMappingURL=word.service.js.map