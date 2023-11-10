import { MaestroService } from "./maestro.service";
import { AddWordDto } from "./dto/add-word.dto";
import { UpdateMaestroDto } from "./dto/update-maestro.dto";
export declare class MaestroController {
    private readonly maestroService;
    constructor(maestroService: MaestroService);
    create(addWordDto: AddWordDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMaestroDto: UpdateMaestroDto): string;
    remove(id: string): string;
}
