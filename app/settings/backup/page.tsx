import { BackupRestoreForm } from "@/components/forms/backup-restore-form"

export default function BackupPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Backup & Restore</h1>
        <p className="text-muted-foreground">Create backups of your system data and restore from previous backups</p>
      </div>

      <BackupRestoreForm />
    </div>
  )
}

