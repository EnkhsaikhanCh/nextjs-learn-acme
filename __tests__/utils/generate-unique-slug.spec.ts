import { generateUniqueSlug } from "@/utils/generate-unique-slug";
import { GraphQLError } from "graphql";

describe("generateUniqueSlug", () => {
  const title = "My Test Course";
  const baseSlug = "my-test-course";

  it("returns base slug when it does not exist", async () => {
    const mockModel = { exists: jest.fn().mockResolvedValue(false) };
    const slug = await generateUniqueSlug(title, mockModel);
    expect(mockModel.exists).toHaveBeenCalledWith({ slug: baseSlug });
    expect(slug).toBe(baseSlug);
  });

  it("returns first candidate slug when base exists but slug-1 is free", async () => {
    const mockModel = {
      exists: jest
        .fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false),
    };
    const slug = await generateUniqueSlug(title, mockModel);
    expect(mockModel.exists).toHaveBeenNthCalledWith(1, { slug: baseSlug });
    expect(mockModel.exists).toHaveBeenNthCalledWith(2, {
      slug: `${baseSlug}-1`,
    });
    expect(slug).toBe(`${baseSlug}-1`);
  });

  it("returns second candidate when base and first exist but slug-2 is free", async () => {
    const mockModel = {
      exists: jest
        .fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false),
    };
    const slug = await generateUniqueSlug(title, mockModel);
    expect(mockModel.exists).toHaveBeenNthCalledWith(1, { slug: baseSlug });
    expect(mockModel.exists).toHaveBeenNthCalledWith(2, {
      slug: `${baseSlug}-1`,
    });
    expect(mockModel.exists).toHaveBeenNthCalledWith(3, {
      slug: `${baseSlug}-2`,
    });
    expect(slug).toBe(`${baseSlug}-2`);
  });

  it("throws GraphQLError with code SLUG_CONFLICT after maxRetries collisions", async () => {
    const maxRetries = 3;
    const mockModel = { exists: jest.fn().mockResolvedValue(true) };

    let caughtError: GraphQLError | undefined;
    try {
      await generateUniqueSlug(title, mockModel, maxRetries);
    } catch (err: unknown) {
      caughtError = err as GraphQLError;
    }

    expect(caughtError).toBeInstanceOf(GraphQLError);
    expect(caughtError?.message).toBe("Too many slug collisions");
    expect(caughtError?.extensions?.code).toBe("SLUG_CONFLICT");

    expect(mockModel.exists).toHaveBeenCalledTimes(1 + maxRetries);
    expect(mockModel.exists).toHaveBeenCalledWith({ slug: baseSlug });
    for (let i = 1; i <= maxRetries; i++) {
      expect(mockModel.exists).toHaveBeenCalledWith({
        slug: `${baseSlug}-${i}`,
      });
    }
  });
});
