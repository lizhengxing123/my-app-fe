export interface Result<T> {
    success: boolean
    msg: string
    data: T
}