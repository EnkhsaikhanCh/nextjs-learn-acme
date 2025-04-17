// src/utils/generate-unique-slug.ts
import { GraphQLError } from "graphql";

export const generateUniqueSlug = async (
  title: string,
  model: { exists: (filter: object) => Promise<unknown> },
  maxRetries = 20,
): Promise<string> => {
  // Шууд slugify хийх
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9а-яөү]/g, " ")
    .trim()
    .replace(/\s+/g, "-");

  // Slug давхцах эсэх шалгах
  const baseExists = await model.exists({ slug: baseSlug });
  if (!baseExists) {
    return baseSlug;
  }

  for (let i = 1; i <= maxRetries; i++) {
    const candidate = `${baseSlug}-${i}`;
    const exists = await model.exists({ slug: candidate });
    if (!exists) {
      return candidate;
    }
  }

  throw new GraphQLError("Too many slug collisions", {
    extensions: { code: "SLUG_CONFLICT" },
  });
};
