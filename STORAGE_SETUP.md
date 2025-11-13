# Supabase Storage Setup for Equipment Images

## Create Storage Bucket

You need to create a storage bucket in Supabase for the equipment cover photos to work.

### Steps:

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Configure the bucket:
   - **Name**: `equipment-images`
   - **Public bucket**: ✅ **Enabled** (check this box)
   - **File size limit**: 5 MB (optional, default is fine)
   - **Allowed MIME types**: Leave empty or add: `image/jpeg, image/jpg, image/png, image/webp, image/gif`

5. Click **Create Bucket**

### Set Storage Policies (Optional but Recommended)

To allow public read access and authenticated write access:

1. Click on the `equipment-images` bucket
2. Go to **Policies** tab
3. Add the following policies:

#### Public Read Access
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'equipment-images' );
```

#### Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'equipment-images' 
  AND auth.role() = 'authenticated'
);
```

#### Authenticated Delete (for cleanup)
```sql
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'equipment-images'
  AND auth.role() = 'authenticated'
);
```

## Testing

After setup, you should be able to:
- Upload images through the Equipment form (max 5MB)
- View uploaded images on equipment cards
- Images will be publicly accessible via CDN

## File Format Support

- JPEG/JPG
- PNG
- WebP
- GIF

Maximum file size: 5MB

