import { UserV2Model } from "../app/api/graphql/models";

/**
 * Бүртгэлтэй байгаа эсэхийг давхар шалгаж, давтагдашгүй 6 оронтой оюутны ID үүсгэх функц
 * Давтамжтай гарвал 10 хүртэл удаа дахин оролдоно
 */
export const generateUniqueStudentId = async (): Promise<string> => {
  let retries = 0;
  const maxRetries = 10;

  while (retries < maxRetries) {
    try {
      // 100000 - 999999 хооронд санамсаргүй 6 оронтой тоо үүсгэх
      const studentId = Math.floor(100000 + Math.random() * 900000).toString();
      const existingUser = await UserV2Model.findOne({ studentId });

      if (!existingUser) {
        return studentId; // олдоогүй бол энэ studentId-г буцаана
      }

      retries++;
    } catch {
      throw new Error("Database error occurred while generating student ID");
    }
  }

  throw new Error("Exceeded maximum retries to generate unique studentId");
};
