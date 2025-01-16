import { TextEncoder, TextDecoder } from "util";
Object.defineProperty(global, "TextEncoder", { value: TextEncoder });
Object.defineProperty(global, "TextDecoder", { value: TextDecoder });
process.env.ENCRYPTION_KEY =
  "9ec99dcce8e18bd7afbd481b50338bdd8d7a96b98ee1bade1ea1822be6637098";
