// src/app/api/graphql/auth.ts
import { GraphQLError } from "graphql";
import { Context } from "./schemas/user.schema";

export function requireUser(context: Context) {
  if (!context.user) {
    throw new GraphQLError("UNAUTHORIZED", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
}
