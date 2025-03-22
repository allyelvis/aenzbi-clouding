import { UserManagementForm } from "@/components/forms/user-management-form"

export default function UsersPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
      </div>

      <UserManagementForm />
    </div>
  )
}

