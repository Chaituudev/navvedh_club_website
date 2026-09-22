export type MongoFailureKind =
  | "tls"
  | "dns"
  | "network-access"
  | "authentication"
  | "uri"
  | "timeout"
  | "unknown";

export interface MongoFailureInfo {
  kind: MongoFailureKind;
  title: string;
  details: string[];
}

function errorText(error: unknown) {
  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause;
    const causeText = cause instanceof Error ? ` ${cause.message}` : "";
    return `${error.name}: ${error.message}${causeText}`;
  }
  return String(error);
}

export function classifyMongoFailure(error: unknown): MongoFailureInfo {
  const text = errorText(error).toLowerCase();

  if (
    text.includes("tlsv1 alert internal error") ||
    text.includes("ssl handshake") ||
    text.includes("err_ssl") ||
    text.includes("certificate")
  ) {
    return {
      kind: "tls",
      title: "MongoDB Atlas TLS handshake failed.",
      details: [
        "Use the pinned Node.js 22 runtime included with this project instead of Node 24 while troubleshooting.",
        "In MongoDB Atlas, Network Access must allow the machine that is running this backend.",
        "Check that your firewall, antivirus, VPN, campus network, or ISP is not blocking outbound TCP 27017.",
        "Run `npm run db:check` for DNS, TCP, TLS, and MongoDB diagnostics.",
        "If SRV/DNS is the problem, copy Atlas's standard (non-SRV) mongodb:// connection string and use it as MONGODB_URI.",
      ],
    };
  }

  if (
    text.includes("querysrv") ||
    text.includes("enotfound") ||
    text.includes("eai_again") ||
    text.includes("dns")
  ) {
    return {
      kind: "dns",
      title: "MongoDB hostname/SRV lookup failed.",
      details: [
        "Try a public DNS resolver such as 1.1.1.1 or 8.8.8.8.",
        "You can also use Atlas's standard non-SRV mongodb:// connection string.",
        "Run `npm run db:check` to see the exact hostname resolution result.",
      ],
    };
  }

  if (
    text.includes("authentication failed") ||
    text.includes("bad auth") ||
    text.includes("auth failed") ||
    text.includes("code 18")
  ) {
    return {
      kind: "authentication",
      title: "MongoDB database-user authentication failed.",
      details: [
        "Use a MongoDB DATABASE user, not your MongoDB Atlas website login.",
        "If the database password contains @, :, /, ?, #, [, ], or %, URL-encode it in MONGODB_URI.",
        "The safest option is to copy a fresh application connection string from Atlas and replace <db_password> with an encoded password.",
      ],
    };
  }

  if (
    text.includes("invalid scheme") ||
    text.includes("invalid connection string") ||
    text.includes("mongodb_uri") ||
    text.includes("uri malformed")
  ) {
    return {
      kind: "uri",
      title: "MONGODB_URI is invalid.",
      details: [
        "Use a URI beginning with mongodb+srv:// for Atlas or mongodb:// for a local/standard connection.",
        "Do not wrap the URI in smart quotes and do not leave <db_password> in the value.",
      ],
    };
  }

  if (
    text.includes("server selection timed out") ||
    text.includes("timed out") ||
    text.includes("etimedout")
  ) {
    return {
      kind: "timeout",
      title: "MongoDB could not be reached before the connection timeout.",
      details: [
        "Verify Atlas Network Access and that your current public IP is allowed.",
        "Verify outbound TCP 27017 is not blocked.",
        "Run `npm run db:check` to isolate DNS/TCP/TLS failures.",
      ],
    };
  }

  if (
    text.includes("econnrefused") ||
    text.includes("connection refused") ||
    text.includes("network")
  ) {
    return {
      kind: "network-access",
      title: "MongoDB network connection was refused.",
      details: [
        "For Atlas, add the backend machine's public IP in Atlas Network Access.",
        "For local MongoDB, make sure the MongoDB service is running on the host/port in MONGODB_URI.",
      ],
    };
  }

  return {
    kind: "unknown",
    title: "MongoDB connection failed.",
    details: ["Run `npm run db:check` for a more detailed diagnosis."],
  };
}

export function printMongoFailure(error: unknown) {
  const info = classifyMongoFailure(error);
  const raw = errorText(error);

  console.error(`\n[database] ${info.title}`);
  console.error(`[database] ${raw}`);
  for (const item of info.details) console.error(`[database] - ${item}`);
  console.error("");
}
