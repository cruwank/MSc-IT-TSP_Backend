import {HttpException, HttpStatus} from "@nestjs/common";

export function validateParams(params: Record<string, any>, requiredFields: string[]): void {
    for (const field of requiredFields) {
        if (!params[field]) {
            throw new HttpException(`${field} is mandatory`, HttpStatus.BAD_REQUEST);
        }
    }
}
