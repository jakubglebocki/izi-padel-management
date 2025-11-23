import { createClient } from '@/lib/supabase/client'

export async function uploadCourtAvatar(file: File, userId: string): Promise<string | null> {
  try {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const filePath = fileName

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('court-avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Error uploading file:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('court-avatars')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error in uploadCourtAvatar:', error)
    return null
  }
}

export async function deleteCourtAvatar(avatarUrl: string): Promise<boolean> {
  try {
    const supabase = createClient()
    
    // Extract file path from URL
    const urlParts = avatarUrl.split('/court-avatars/')
    if (urlParts.length < 2) return false
    
    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('court-avatars')
      .remove([filePath])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteCourtAvatar:', error)
    return false
  }
}


