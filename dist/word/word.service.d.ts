import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
export declare class WordService {
    create(createWordDto: CreateWordDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateWordDto: UpdateWordDto): string;
    remove(id: number): string;
}
