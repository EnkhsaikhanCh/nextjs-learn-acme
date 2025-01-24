import { SectionModel } from "@/app/api/graphql/models";
import { updateSection } from "@/app/api/graphql/resolvers/mutations";
import { UpdateSectionInput } from "@/app/api/graphql/schemas/section.schema";
import { GraphQLError } from "graphql";

jest.mock("../../../../../src/app/api/graphql/models/section.model");

describe("updateSection - Full Coverage", () => {
  const mockFindById = SectionModel.findById as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test each optional field
  const fields = [
    { field: "title", value: "New Title" },
    { field: "description", value: "New Description" },
    { field: "order", value: 1 },
  ];

  fields.forEach(({ field, value }) => {
    it("should throw an error if the section ID is missing", async () => {
      const input: Partial<UpdateSectionInput> = {
        title: "New Title",
      };

      await expect(
        updateSection({}, { _id: "", input: input as UpdateSectionInput }),
      ).rejects.toThrow("Section ID is required");
    });

    it("should throw an error if the section is not found", async () => {
      mockFindById.mockResolvedValue(null);

      const input: UpdateSectionInput = {
        title: "New Title",
        description: "",
        order: 0,
      };

      await expect(updateSection({}, { _id: "123", input })).rejects.toThrow(
        "Section not found",
      );

      expect(mockFindById).toHaveBeenCalledWith("123");
    });

    it("should rethrow a GraphQLError if caught", async () => {
      const error = new GraphQLError("Test GraphQL error");
      mockFindById.mockImplementation(() => {
        throw error;
      });

      const input = {
        _id: "123",
        title: "New Title",
        description: "",
        order: 0,
      };

      await expect(updateSection({}, { _id: "123", input })).rejects.toThrow(
        error,
      );

      expect(mockFindById).toHaveBeenCalledWith("123");
    });

    it(`should update the section's ${field}`, async () => {
      const section: {
        [key: string]: any;
        _id: string;
        title: string;
        description: string;
        order: number;
        save: jest.Mock;
      } = {
        _id: "123",
        title: "Old Title",
        description: "Old Description",
        order: 0,
        save: jest.fn(),
      };

      mockFindById.mockResolvedValue(section);

      const input: UpdateSectionInput = {
        title: "Old Title",
        description: "Old Description",
        order: 0,
        [field]: value,
      };

      await updateSection({}, { _id: "123", input });

      expect(mockFindById).toHaveBeenCalledWith("123");
      expect(section[field]).toBe(value);
      expect(section.save).toHaveBeenCalled();
    });
  });
});
