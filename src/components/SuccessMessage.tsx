import { motion } from "framer-motion";

export const SucessMessage = ({ description }: { description: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="relative flex flex-col rounded border-2 border-green-400 bg-green-100 px-4 py-3 text-green-700"
          role="alert"
        >
          <strong className="font-bold">Амжилттай!</strong>
          <span className="block sm:inline"> {description}</span>
        </div>
      </div>
    </motion.div>
  );
};
