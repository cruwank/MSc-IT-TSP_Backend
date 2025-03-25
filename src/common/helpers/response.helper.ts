import { HttpException, HttpStatus } from '@nestjs/common';
import {EAttendanceResponse} from "../dto/response.dto";

export function handleApiResponse<T>(
    successMessage: string,
    successStatus: HttpStatus,
    payload: T | null,
    error: unknown,
): EAttendanceResponse<T> {
    if (payload) {
        return new EAttendanceResponse<T>(successStatus, successMessage, payload);
    }

    // Handle specific error types
    if (error instanceof HttpException) {
        throw new HttpException(
            new EAttendanceResponse<null>(
                error.getStatus(),
                error.message,
                null,
            ),
            error.getStatus(),
        );
    }

    // Handle generic errors
    throw new HttpException(
        new EAttendanceResponse<null>(
            HttpStatus.INTERNAL_SERVER_ERROR,
            'An unexpected error occurred',
            null,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
}
