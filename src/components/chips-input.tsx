/* eslint-disable react/jsx-key */
import * as React from "react";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useTheme } from "next-themes";

export type ChipOption = {
  id: number;
  name: string;
};

export default function ChipsInput({
  placeholder,
  options,
  savedOptions,
  onUpdate,
}: {
  placeholder: string;
  options: ChipOption[];
  savedOptions: ChipOption[];
  onUpdate: (newValue: ChipOption[]) => void;
}) {
  const theme = useTheme();

  const darkTheme = createTheme({
    palette: {
      mode: theme.theme === "light" ? "light" : "dark",
      primary: {
        light: "#000",
        dark: "#fff",
        main: theme.theme === "light" ? "#000" : "#fff",
      },
    },
  });

  const fixedOptions: ChipOption[] = [];
  const [value, setValue] = React.useState([...fixedOptions, ...savedOptions]);
  onUpdate(value);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Autocomplete
        multiple
        value={value}
        onChange={(event, newValue) => {
          const update = [
            ...fixedOptions,
            ...newValue.filter(
              (_option) => fixedOptions.indexOf(_option) === -1,
            ),
          ];
          setValue(update);
          onUpdate(update);
        }}
        options={options}
        getOptionLabel={(option: ChipOption) => option.name}
        isOptionEqualToValue={(option, value) => option.id == value.id}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          );
        }}
        renderTags={(tagValue, getTagProps) => {
          return tagValue.map((option, index) => {
            const tags = getTagProps({ index });
            const goodTags = {
              className: tags.className,
              onDelete: tags.onDelete,
              "data-tag-index": tags["data-tag-index"],
              disabled: tags.disabled,
              tabIndex: tags.tabIndex,
            };
            return (
              <Chip
                key={option.id}
                {...goodTags}
                label={option.name}
                disabled={fixedOptions.indexOf(option) !== -1}
              />
            );
          });
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder={placeholder} />
        )}
      />
    </ThemeProvider>
  );
}
