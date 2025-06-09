// src/app/leagues/components/edit-leagues-form.tsx
"use client";
import UpsertLeaguesForm, { League } from "./upsert-leagues-form";

interface EditLeaguesFormProps {
  existingLeague: League;
  onSubmitSuccess: () => void;
}

export default function EditLeaguesForm({
  existingLeague,
  onSubmitSuccess,
}: EditLeaguesFormProps) {
  return (
    <UpsertLeaguesForm
      existingLeague={existingLeague}
      onSubmitSuccess={onSubmitSuccess}
    />
  );
}
