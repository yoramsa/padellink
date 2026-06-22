"use client";

export default function DeleteForm({
  action,
  id,
  label = "Supprimer",
  message = "Confirmer la suppression ?"
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
  message?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm font-medium text-mauve hover:underline"
      >
        {label}
      </button>
    </form>
  );
}
