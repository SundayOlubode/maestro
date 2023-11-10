import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
export declare class WordController {
    private readonly wordService;
    constructor(wordService: WordService);
    create(createWordDto: CreateWordDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateWordDto: UpdateWordDto): string;
    remove(id: string): string;
}
