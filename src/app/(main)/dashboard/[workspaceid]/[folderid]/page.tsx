export const dynamic = 'force-dynamic'

import QuillEditor from '@/components/quill-editor/quill-editor';
import { getFolderDetails } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
import React from 'react'

const FolderPage = async ({ params }: { params: { folderid: string } }) => {
  const { data, error } = await getFolderDetails(params.folderid);
  // if (error || !data.length) redirect('/dashboard');

  return (
    <div className="relative">
      <QuillEditor
        dirType="folder"
        fileId={params.folderid}
        dirDetails={data[0] || {}}
      />
    </div>
  )
}

export default FolderPage