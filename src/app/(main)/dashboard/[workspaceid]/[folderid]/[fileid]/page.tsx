export const dynamic = 'force-dynamic'

import QuillEditor from '@/components/quill-editor/quill-editor';
import { getFileDetails } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
import React from 'react'

const FilePage = async ({ params }: { params: { fileid: string } }) => {
  const { data, error } = await getFileDetails(params.fileid);
  // if (error || !data.length) redirect('/dashboard');

  return (
    <div className="relative">
      <QuillEditor
        dirType="file"
        fileId={params.fileid}
        dirDetails={data[0] || {}}
      />
    </div>
  )
}

export default FilePage