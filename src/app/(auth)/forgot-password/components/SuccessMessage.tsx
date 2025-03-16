import { motion } from "framer-motion";

export const SucessMessage = () => {
  return (
    <motion.div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="relative flex flex-col rounded border-2 border-green-400 bg-green-100 px-4 py-3 text-green-700"
          role="alert"
        >
          <strong className="font-bold">Амжилттай!</strong>
          <span className="block sm:inline">
            {" "}
            Таны и-мэйл хаяг руу холбоос амжилттай илгээгдлээ.
          </span>
        </div>
      </div>
    </motion.div>
  );
};
