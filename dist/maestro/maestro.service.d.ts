import { AddWordDto } from "./dto/add-word.dto";
import { UpdateMaestroDto } from "./dto/update-maestro.dto";
export declare class MaestroService {
    create(addWordDto: AddWordDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateMaestroDto: UpdateMaestroDto): string;
    remove(id: number): string;
}
