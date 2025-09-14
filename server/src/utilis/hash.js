import { createHmac} from 'crypto';
import 'dotenv/config'

const secret = process.env.secret_key


export function getHash(key) {
    const sha256Hasher = createHmac("sha256", secret);
    return sha256Hasher.update(key).digest("base64");
}