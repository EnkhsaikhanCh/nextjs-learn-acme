// auth.ts
import { GraphQLError } from "graphql";

export function requireUser(context: any) {
  if (!context.user) {
    throw new GraphQLError("UNAUTHORIZED", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
}
