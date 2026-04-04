import { handleAdminImageUpload } from "@/lib/admin-upload-handler"

export async function POST(request: Request) {
  return handleAdminImageUpload(request)
}
