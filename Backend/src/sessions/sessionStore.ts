export interface SessionData{
    id:number,
    role:string
}

export const sessionMap = new Map<string,SessionData>()