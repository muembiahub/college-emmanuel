import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";

export default function ActionMenu({
  student,
  onEdit,
  onDelete,
}) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className="
          p-2
          rounded-lg
          hover:bg-slate-700
          transition
        "
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-2
            w-44
            rounded-xl
            bg-slate-800
            border
            border-slate-700
            shadow-2xl
            overflow-hidden
            z-50
          "
        >
          <button
            onClick={() => {
              setOpen(false);
              onEdit(student);
            }}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              hover:bg-slate-700
              transition
            "
          >
            <Edit
              size={16}
              className="text-blue-400"
            />

            Modifier
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete(student);
            }}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              hover:bg-red-600/20
              transition
              text-red-400
            "
          >
            <Trash2 size={16} />

            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}