import { CreateCommonDto } from './dto/create-common.dto';
import { UpdateCommonDto } from './dto/update-common.dto';
export declare class CommonService {
    create(createCommonDto: CreateCommonDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCommonDto: UpdateCommonDto): string;
    remove(id: number): string;
}
