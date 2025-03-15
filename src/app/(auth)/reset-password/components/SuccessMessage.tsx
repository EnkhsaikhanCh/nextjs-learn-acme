import { motion } from "framer-motion";

export const SuccessMessage = () => {
  return (
    <motion.div>
      <div className="-mt-9 p-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="relative rounded border-2 border-green-400 bg-green-100 px-4 py-3 text-center text-green-700"
          role="alert"
        >
          <strong className="font-bold">Амжилттай!</strong>
          <span className="block sm:inline">
            {" "}
            Таны нууц үг амжилттай шинэчлэгдлээ. Одоо нэвтрэх боломжтой.
          </span>
        </div>
      </div>
    </motion.div>
  );
};
