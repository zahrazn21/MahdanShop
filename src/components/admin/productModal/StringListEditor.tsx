import { Plus, Trash2 } from "lucide-react";

interface StringListEditorProps {
  label: string;
  addButtonLabel: string;
  placeholder: string;
  items: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export function StringListEditor({
  label,
  addButtonLabel,
  placeholder,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: StringListEditorProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-sm text-pink-600"
        >
          <Plus className="h-4 w-4" />
          {addButtonLabel}
        </button>
      </div>

      <div className="space-y-2">
        {(Array.isArray(items) ? items : []).map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2"
            />

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
