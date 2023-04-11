import { Controller } from "@nestjs/common";
import { DbService } from "./db.service.js";

@Controller("db")
export class DbController {
    constructor(private readonly dbService: DbService) {}
}
