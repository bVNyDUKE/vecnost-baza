import { SearchStore, Regions, Option } from "../../../stores/searchStore";
import { Cross } from "../../Icons";

interface OptionDropdownProps {
  def: keyof typeof Regions;
  options: Option[];
  choice: string | null;
  setChoice: SearchStore["setOption"];
  clearChoice: () => void;
}

export const OptionDropdown = ({
  def,
  options,
  choice,
  setChoice,
  clearChoice,
}: OptionDropdownProps) => {
  if (choice !== null) {
    return (
      <div
        className="flex w-1/3 flex-grow items-center justify-between bg-white p-2 text-center text-sm capitalize hover:cursor-pointer"
        onClick={clearChoice}
      >
        <div className="flex w-full justify-center">
          <span className="truncate">
            {options.find((option) => option.id == choice)?.name}
          </span>
        </div>
        <div>
          <Cross />
        </div>
      </div>
    );
  }

  if (options.length === 0) {
    return null;
  }

  return (
    <select
      onChange={(e) => setChoice(def, e.target.value)}
      className="w-1/3 bg-white p-2 text-center text-sm capitalize"
    >
      <option className="text-clip text-xs" value="0" label={def} />
      {options.map((option) => (
        <option
          className="text-clip text-xs"
          key={option.id}
          value={option.id}
          label={option.name}
        />
      ))}
    </select>
  );
};
