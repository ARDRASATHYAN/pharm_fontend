import React, { useState, useEffect } from "react";
import { TextField, Box, Button, CircularProgress, Autocomplete, Paper } from "@mui/material";
import { Controller } from "react-hook-form";
import { useDrugSchedule } from "@/hooks/useDrugSchedule";

export default function DrugScheduleSelect({ control, errors, editMode, onOpenDrugScheduleForm }) {
  const [drugSearch, setDrugSearch] = useState("");
  const [page, setPage] = useState(1);
  const [drugs, setDrugs] = useState([]);
  const perPage = 5;

  const { data: drugData = {}, isLoading: loadingDrug } = useDrugSchedule({
    search: drugSearch,
    page,
    perPage,
  });

  // Append new page data
  useEffect(() => {
    if (page === 1) {
      setDrugs(drugData.data || []);
    } else {
      setDrugs((prev) => [...prev, ...(drugData.data || [])]);
    }
  }, [drugData.data, page]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [drugSearch]);

  // Scroll handler
  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
      listboxNode.scrollHeight - 1
    ) {
      if (drugData.totalPages && page < drugData.totalPages && !loadingDrug) {
        setPage((p) => p + 1);
      }
    }
  };

  return (
    <Controller
      name="schedule_id"
      control={control}
      render={({ field }) => (
        <Autocomplete
          options={drugs}
          getOptionLabel={(option) =>
            `${option.schedule_code} - ${option.schedule_name}`
          }
          value={drugs.find((s) => s.schedule_id === field.value) || null}
          onChange={(e, val) => field.onChange(val ? val.schedule_id : "")}
          isOptionEqualToValue={(o, v) => o.schedule_id === v?.schedule_id}
          onInputChange={(e, value, reason) => {
            if (reason === "input") setDrugSearch(value);
          }}

          // Scrollable dropdown
          ListboxProps={{
            onScroll: handleScroll,
            style: { maxHeight: 150, overflowY: "auto" },
          }}

          renderInput={(params) => (
            <TextField
              {...params}
              label="Schedule Code"
              size="small"
              error={!!errors.schedule_id}
              helperText={errors.schedule_id?.message}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingDrug && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}

          disabled={editMode}
          noOptionsText={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <span>No Schedule Found</span>
              <Button
                variant="outlined"
                size="small"
                onClick={onOpenDrugScheduleForm}
              >
                Add
              </Button>
            </Box>
          }
          fullWidth
        />
      )}
    />
  );
}
