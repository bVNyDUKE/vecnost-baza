import { useSearchStore } from "../../../stores/searchStore";
import { OptionDropdown } from "./OptionsDropdown";

export const AdvancedOptions = () => {
  const filter = useSearchStore((state) => state.filter);
  const options = useSearchStore((state) => state.options);
  const setOption = useSearchStore((state) => state.setOption);
  const clearOption = useSearchStore((state) => state.clearOption);

  //try looping over the regions enum instead?
  return (
    <div className="mb-10">
      <div className="flex h-10 items-center justify-between">
        <OptionDropdown
          def="okrug"
          choice={filter.okrug}
          options={options.okrug}
          setChoice={setOption}
          clearChoice={() => clearOption("okrug")}
        />
        <OptionDropdown
          def="opstina"
          choice={filter.opstina}
          options={options.opstina}
          setChoice={setOption}
          clearChoice={() => clearOption("opstina")}
        />
        <OptionDropdown
          def="groblje"
          choice={filter.groblje}
          options={options.groblje}
          setChoice={setOption}
          clearChoice={() => clearOption("groblje")}
        />
      </div>
    </div>
  );
};
