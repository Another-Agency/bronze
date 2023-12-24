
type sendMessageRequest = {
    token: string;
    type: "keygen" | "sign" | "pairing" | "backup";
    conversation: T | null;
    expectResponse: boolean;
    docId?: string;
}

export async function POST(req: Request, res: Response) {


}