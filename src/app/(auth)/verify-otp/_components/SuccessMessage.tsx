// _components/SuccessMessage.tsx
import { motion } from "framer-motion";

export const SuccessMessage: React.FC = () => (
  <div className="flex flex-col p-5">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="relative flex flex-col gap-2 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
          role="alert"
        >
          <strong className="font-bold">Амжилттай!</strong>
          <span className="block sm:inline">
            {" "}
            Таны баталгаажуулалт амжилттай боллоо. Тун удахгүй таныг удирдлагын
            самбар руу шилжүүлнэ...
          </span>
        </div>
      </div>
    </motion.div>
  </div>
);
