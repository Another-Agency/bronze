import { ErrorCode, SdkError } from '../error';
import { sendMessage } from '../firebaseEndpoints';
import { BackupConversation, PairingData } from '../types';

export const backup = async (
    pairingData: PairingData,
    encryptedMessage: string,
) => {
    try {
        const response = await sendMessage(
            pairingData.token,
            'backup',
            {
                backupData: encryptedMessage,
                pairingId: pairingData.pairingId,
                createdAt: Date.now(),
                expiry: 30000,
            } as BackupConversation,
            false,
        );
        if (response && !response.isBackedUp) {
            throw new SdkError('Backup failed', ErrorCode.BackupFailed);
        }
    } catch (error) {
        if (error instanceof SdkError) {
            throw error;
        } else if (error instanceof Error) {
            throw new SdkError(error.message, ErrorCode.BackupFailed);
        } else throw new SdkError('unknown-error', ErrorCode.UnknownError);
    }
};

