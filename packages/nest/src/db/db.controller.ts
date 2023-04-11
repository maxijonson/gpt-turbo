import { Controller, Post } from "@nestjs/common";
import { DbService } from "./db.service.js";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("db")
@ApiTags("db")
export class DbController {
    constructor(private readonly dbService: DbService) {}

    @Post("save")
    @ApiOperation({
        description: "Save the current state of the database",
    })
    save() {
        return this.dbService.save();
    }
}
