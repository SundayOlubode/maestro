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
const fs = require("fs");
const constants_1 = require("../constants");
const email_service_1 = require("../email/email.service");
const modelName = 'gpt-4o-mini';
let WordService = class WordService {
    constructor(db, openai, emailService) {
        this.db = db;
        this.openai = openai;
        this.emailService = emailService;
    }
    async create(dto, user) {
        let word = dto.word.toLowerCase();
        if (!constants_1.EnglishWords.check(word)) {
            throw new common_1.BadRequestException(`${dto.word} is not a valid English word`);
        }
        const wordExists = await this.db.word.findFirst({
            where: {
                word,
            },
        });
        if (wordExists) {
            await this.updateWordUsersAndCounter(wordExists, user);
            return this.wordCreateResponse(word);
        }
        await this.generateWordMeaningAndUsages(word, user);
        return this.wordCreateResponse(word);
    }
    wordCreateResponse(word) {
        return {
            status: 'success',
            message: 'Word created successfully',
            data: {
                word,
            },
        };
    }
    async createWordUsagesFromGPT(word) {
        const response = await this.openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: constants_1.SYSTEM_CONTENT,
                },
                { role: 'user', content: word },
            ],
            temperature: 1.0,
            top_p: 1.0,
            max_tokens: 1000,
            model: modelName,
        });
        return response.choices[0].message.content;
    }
    async generateWordMeaningAndUsages(wordText, user) {
        const intervalId = setInterval(async () => {
            const response = await this.createWordUsagesFromGPT(wordText);
            if (response) {
                await this.createWordFromAIResult(response, wordText, user);
                console.log('Word created successfully', response[100]);
                clearInterval(intervalId);
            }
        }, 20000);
        return;
    }
    async createWordFromAIResult(result, wordText, user) {
        const parts = result.split('**');
        const meaning = parts.length >= 3 ? parts[2].trim() : '';
        const usages = [];
        const usageRegex = /\d+\.?\s+(.*?)(?:\.|$)/gm;
        let match;
        while ((match = usageRegex.exec(result)) !== null) {
            const usage = match[1].trim();
            if (usage) {
                usages.push(usage);
            }
        }
        fs.appendFileSync('word-meaning-and-usages.txt', result + '\n\n');
        await this.db.word.create({
            data: {
                word: wordText,
                meaning,
                usages,
                users: {
                    connect: {
                        id: user.id,
                    },
                },
                counters: {
                    create: {
                        user_id: user.id,
                        countdown: constants_1.NODE_ENV === 'development' ? 10 : 40,
                    },
                },
            },
        });
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
    async sendWordUsagesToUsers() {
        const users = await this.findUsersFromCounters();
        console.log('USERS', users);
        const totalCounters = [];
        let allWords = {};
        await this.selectWordUsers(users, totalCounters, allWords);
        console.log('ALL WORDS', allWords);
        await this.emailService.sendWordUsagesToUsers(allWords);
        await this.decrementCounters(totalCounters);
        return {
            status: 'success',
            message: 'Word usages sent successfully',
        };
    }
    async findUsersFromCounters() {
        const users = await this.db.counter.findMany({
            distinct: ['user_id'],
            select: {
                user_id: true,
                user: true,
            },
            where: {
                countdown: {
                    gt: 0,
                },
            },
        });
        return users;
    }
    async selectWordUsers(users, totalCounters, allWords) {
        for (let user of users) {
            const counters = await this.db.counter.findMany({
                where: {
                    user_id: user.user_id,
                },
                select: {
                    id: true,
                    word: true,
                    countdown: true,
                },
                orderBy: {
                    countdown: 'asc',
                },
                take: 3,
            });
            allWords[user.user.email] = counters;
            totalCounters.push(...counters);
        }
        return;
    }
    async decrementCounters(counters) {
        for (let counter of counters) {
            await this.db.counter.update({
                where: {
                    id: counter.id,
                },
                data: {
                    countdown: counter.countdown - constants_1.NUMWORDUSAGES,
                },
            });
        }
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
        email_service_1.EmailService])
], WordService);
//# sourceMappingURL=word.service.js.map