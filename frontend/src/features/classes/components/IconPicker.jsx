import { useState, useRef, useEffect } from "react";
import { cn }           from "@/lib/utils";
import { CLASS_ICONS }  from "@/features/classes/api/classes";
import * as LucideIcons from "lucide-react";
import { Upload }       from "lucide-react";

const TABS = ["emoji", "icons", "upload"];

export function IconPicker({ value, onChange }) {
  const [tab, setTab]         = useState("emoji")
  const [preview, setPreview] = useState(null)
  const fileRef               = useRef(null)

  // Sync preview with incoming value (fixes edit dialog + tab switching)
  useEffect(() => {
    if (value?.type === 'image' && value?.value) {
      setPreview(value.value)
      setTab('upload')
    }
  }, [value?.type, value?.value])

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
      onChange({ type: "image", value: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onChange({ type: 'emoji', value: '📚' })
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2.5 text-xs font-semibold capitalize transition-colors",
              tab === t
                ? "bg-primary/10 text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "emoji" ? "😊 Emoji" : t === "icons" ? "🎨 Icons" : "📷 Upload"}
          </button>
        ))}
      </div>

      {/* Emoji tab */}
      {tab === "emoji" && (
        <div className="p-3 grid grid-cols-10 gap-1">
          {CLASS_ICONS.emoji.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onChange({ type: "emoji", value: emoji })}
              className={cn(
                "flex items-center justify-center text-xl w-9 h-9 rounded-lg hover:bg-muted transition-colors",
                value?.type === "emoji" && value?.value === emoji
                  ? "bg-primary/20 ring-2 ring-primary"
                  : "",
              )}
            >
              <span style={{ lineHeight: 1 }}>{emoji}</span>
            </button>
          ))}
        </div>
      )}

      {/* Icons tab */}
      {tab === "icons" && (
        <div className="p-3 grid grid-cols-6 gap-2">
          {CLASS_ICONS.lucide.map((iconName) => {
            const Icon = LucideIcons[iconName]
            if (!Icon) return null
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onChange({ type: "lucide", value: iconName })}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors",
                  value?.type === "lucide" && value?.value === iconName
                    ? "bg-primary/20 ring-2 ring-primary"
                    : "",
                )}
              >
                <Icon className="h-5 w-5 text-foreground" />
                <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                  {iconName}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Upload tab */}
      {tab === "upload" && (
        <div className="p-4 flex flex-col items-center gap-3">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="icon"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full h-5 w-5 text-xs flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="h-24 w-full rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors"
            >
              <Upload className="h-6 w-6" />
              <p className="text-xs">Click to upload image</p>
              <p className="text-[10px] opacity-60">PNG, JPG · Max 5MB</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <p className="text-[10px] text-muted-foreground text-center">
            Image stored as base64 · Max 5MB recommended
          </p>
        </div>
      )}
    </div>
  )
}