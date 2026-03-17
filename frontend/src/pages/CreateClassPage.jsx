import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateClass } from "@/features/classes";
import { IconPicker } from "@/features/classes/components/IconPicker";
import { ClassIcon } from "@/features/classes/components/ClassIcon";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CLASS_COLORS } from "@/features/classes/api/classes";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  isPublic: z.boolean(),
});

export default function CreateClassPage() {
  const { submit, isLoading, error } = useCreateClass();
  const [icon, setIcon] = useState({ type: "emoji", value: "📚" });
  const [color, setColor] = useState(CLASS_COLORS[0].value);
  const [isPublic, setIsPublic] = useState(false);
  const [previewName, setPreviewName] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isPublic: false },
  });

  const onSubmit = (data) => {
    submit({ ...data, icon, color, isPublic });
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-1">
            Create New Subject
          </h1>
          <p className="text-muted-foreground">
            Group your lesson decks under a subject for organized studying.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Live Preview */}
        <div
          className={cn(
            "rounded-2xl h-32 mb-6 flex items-center px-6 gap-4 bg-gradient-to-br",
            color,
          )}
        >
          <ClassIcon icon={icon} size="lg" />
          <div>
            <p className="text-white/60 text-xs mb-1">Preview</p>
            <p className="text-white font-bold text-lg">
              {previewName.trim() || "Your Subject Name"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Subject Info */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Subject Name</label>
                <Input
                  {...register("name")}
                  placeholder="e.g. Data Structures, Calculus, Philippine History"
                  onChange={(e) => {
                    setPreviewName(e.target.value);
                    register("name").onChange(e);
                  }}
                />
                {errors.name && (
                  <p className="text-destructive text-xs">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Description{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  {...register("description")}
                  placeholder="e.g. Topics and lessons covered in this subject"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 placeholder:text-muted-foreground"
                />
              </div>

              {/* Visibility toggle */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-sm font-medium">Make Public</p>
                  <p className="text-xs text-muted-foreground">
                    Share this subject with the community
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsPublic((v) => !v);
                    setValue("isPublic", !isPublic);
                  }}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                    isPublic ? "bg-primary" : "bg-muted-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform",
                      isPublic ? "translate-x-6" : "translate-x-1",
                    )}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Accent Color */}
          <Card>
            <CardHeader>
              <CardTitle>Accent Color</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                {CLASS_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={cn(
                      "h-10 w-10 rounded-xl bg-gradient-to-br transition-all",
                      c.value,
                      color === c.value
                        ? "ring-2 ring-offset-2 ring-primary scale-110"
                        : "hover:scale-105",
                    )}
                    title={c.label}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Icon Picker */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Icon</CardTitle>
            </CardHeader>
            <CardContent>
              <IconPicker value={icon} onChange={setIcon} />
            </CardContent>
          </Card>

          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Subject"}
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
