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
        const isValidIdiom = await this.validateWord(word);
        if (!isValidIdiom) {
            throw new common_1.BadRequestException(`"${dto.word}" does not appear to be a recognized English word`);
        }
        const wordExists = await this.db.word.findFirst({
            where: {
                word,
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (wordExists) {
            await this.updateWordUsersAndCounter(wordExists, user);
            return this.wordCreateResponse(word);
        }
        await this.generateWordMeaningAndUsages(word, user);
        return this.wordCreateResponse(word);
    }
    async createIdiom(dto, user) {
        let idiom = dto.idiom.toLowerCase().trim();
        const idiomExists = await this.db.word.findFirst({
            where: {
                word: idiom,
                isIdiom: true,
            },
            include: {
                users: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (idiomExists) {
            await this.updateWordUsersAndCounter(idiomExists, user);
            return this.idiomCreateResponse(idiom);
        }
        const isValidIdiom = await this.validateIdiom(idiom);
        if (!isValidIdiom) {
            throw new common_1.BadRequestException(`"${dto.idiom}" does not appear to be a recognized English idiom`);
        }
        await this.generateIdiomMeaningAndUsages(idiom, user);
        return this.idiomCreateResponse(idiom);
    }
    async validateIdiom(phrase) {
        try {
            const response = await this.openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that determines whether a phrase is a recognized English idiom or not. Respond only with "YES" if it is an idiom, or "NO" if it is not.',
                    },
                    {
                        role: 'user',
                        content: `Is "${phrase}" a recognized English idiom or common phrase?`,
                    },
                ],
                temperature: 0.2,
                max_tokens: 10,
                model: modelName,
            });
            const result = response.choices[0].message.content
                .trim()
                .toUpperCase();
            return result.includes('YES');
        }
        catch (error) {
            console.error(`Error validating idiom: ${error.message}`);
            return false;
        }
    }
    async validateWord(phrase) {
        try {
            const response = await this.openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that determines whether a word is a recognized English word or not. Respond only with "YES" if it is a word, or "NO" if it is not.',
                    },
                    {
                        role: 'user',
                        content: `Is "${phrase}" a recognized English word?`,
                    },
                ],
                temperature: 0.2,
                max_tokens: 10,
                model: modelName,
            });
            const result = response.choices[0].message.content
                .trim()
                .toUpperCase();
            return result.includes('YES');
        }
        catch (error) {
            console.error(`Error validating word: ${error.message}`);
            return false;
        }
    }
    async getAllIdioms(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const idioms = await this.db.word.findMany({
            where: {
                isIdiom: true,
            },
            skip,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
        });
        const total = await this.db.word.count({
            where: {
                isIdiom: true,
            },
        });
        return {
            idioms,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getIdiomByText(idiomText) {
        const idiom = await this.db.word.findFirst({
            where: {
                word: idiomText.toLowerCase().trim(),
                isIdiom: true,
            },
        });
        if (!idiom) {
            throw new common_1.BadRequestException(`Idiom "${idiomText}" not found`);
        }
        return idiom;
    }
    idiomCreateResponse(idiom) {
        return {
            status: 'success',
            message: 'Idiom created successfully',
            data: {
                idiom,
            },
        };
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
    async createIdiomUsagesFromGPT(idiom) {
        const response = await this.openai.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: constants_1.IDIOM_SYSTEM_CONTENT,
                },
                { role: 'user', content: idiom },
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
                await this.createWordFromAIResult(response, wordText, user, false);
                console.log('Word created successfully');
                clearInterval(intervalId);
            }
        }, 2000);
        return;
    }
    async generateIdiomMeaningAndUsages(idiomText, user) {
        const intervalId = setInterval(async () => {
            const response = await this.createIdiomUsagesFromGPT(idiomText);
            if (response) {
                await this.createWordFromAIResult(response, idiomText, user, true);
                console.log('Idiom created successfully');
                clearInterval(intervalId);
            }
        }, 2000);
        return;
    }
    async createWordFromAIResult(result, wordText, user, isIdiom = false) {
        const meaningRegex = /\*\*Meaning(?:.*?):\*\*(.*?)(?=\*\*|$)/s;
        const meaningMatch = result.match(meaningRegex);
        const meaning = meaningMatch ? meaningMatch[1].trim() : '';
        const usages = [];
        const usageRegex = /\d+\.?\s+(.*?)(?:\.|$)/gm;
        let match;
        while ((match = usageRegex.exec(result)) !== null) {
            const usage = match[1].trim();
            if (usage) {
                usages.push(usage);
            }
        }
        fs.appendFileSync(isIdiom
            ? 'idiom-meaning-and-usages.txt'
            : 'word-meaning-and-usages.txt', result + '\n\n');
        await this.db.word.create({
            data: {
                word: wordText,
                meaning,
                usages,
                isIdiom,
                users: {
                    connect: {
                        id: user.id,
                    },
                },
                counters: {
                    create: {
                        user_id: user.id,
                        countdown: constants_1.NUM_WORD_TO_GEN,
                    },
                },
            },
        });
        return;
    }
    async updateWordUsersAndCounter(word, user) {
        if (word.users.find((u) => u.id === user.id)) {
            await this.db.counter.updateMany({
                where: {
                    user_id: user.id,
                    word_id: word.id,
                },
                data: {
                    countdown: constants_1.NUM_WORD_TO_GEN,
                },
            });
            return;
        }
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
                countdown: constants_1.NUM_WORD_TO_GEN,
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