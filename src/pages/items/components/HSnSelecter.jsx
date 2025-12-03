import React, { useState, useEffect } from "react";
import { TextField, Box, Button, CircularProgress, Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { useHsn } from "@/hooks/useHsn";

export default function HsnSelect({ control, errors, editMode, onOpenHsnForm }) {
  const [hsnSearch, setHsnSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hsns, setHsns] = useState([]);
  const perPage = 5;

  const { data: hsnsData = {}, isLoading: loadingHsn } = useHsn({ search: hsnSearch, page, perPage });

  useEffect(() => {
    if (page === 1) {
      setHsns(hsnsData.data || []);
    } else {
      setHsns(prev => [...prev, ...(hsnsData.data || [])]);
    }
  }, [hsnsData.data, page]);

  useEffect(() => {
    setPage(1); // reset page on search
  }, [hsnSearch]);

  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 1) {
      if (hsnsData.totalPages && page < hsnsData.totalPages && !loadingHsn) {
        setPage(prev => prev + 1);
      }
    }
  };

  return (
    <Controller
      name="hsn_id"
      control={control}
      render={({ field }) => (
        <Autocomplete
          options={hsns}
         getOptionLabel={(option) =>
  `${option.hsn_code} - ${option.description}`
}
 // only show hsn_code
          value={hsns.find((h) => h.hsn_id === field.value) || null}
          onChange={(e, newValue) => field.onChange(newValue ? newValue.hsn_id : "")} // save hsn_id
          isOptionEqualToValue={(option, value) => option.hsn_id === value?.hsn_id}
          onInputChange={(e, value, reason) => {
            if (reason === "input") setHsnSearch(value);
          }}
          ListboxProps={{
            onScroll: handleScroll,
            style: { maxHeight: 200, overflow: 'auto' },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="HSN Code"
              size="small"
              error={!!errors.hsn_id}
              helperText={errors.hsn_id?.message}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingHsn ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          disabled={editMode}
          noOptionsText={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <span>No HSN found</span>
              <Button size="small" onClick={onOpenHsnForm}>Add HSN</Button>
            </Box>
          }
          fullWidth
        />
      )}
    />
  );
}
