export class EAttendanceResponse<T> {
    status: number;

    message: string;

    data: T;

    constructor(status: number, message: string, data: T) {
      this.status = status;
      this.message = message;
      this.data = data;
    }
  }
