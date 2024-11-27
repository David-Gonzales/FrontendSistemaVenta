import { Response } from "./response";

export interface PagedResponse<T> extends Response<T> {
  pageNumber: number,
  pageSize: number
}
