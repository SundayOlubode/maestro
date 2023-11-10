import { CommonService } from './common.service';
import { CreateCommonDto } from './dto/create-common.dto';
import { UpdateCommonDto } from './dto/update-common.dto';
export declare class CommonController {
    private readonly commonService;
    constructor(commonService: CommonService);
    create(createCommonDto: CreateCommonDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCommonDto: UpdateCommonDto): string;
    remove(id: string): string;
}
