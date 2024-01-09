'use client';

import { workspace } from '@/lib/supabase/supabase.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

interface SelectedWorkSpaceProps {
  workspace: workspace;
  onClick?: () => void;
}

const SelectedWorkspace: React.FC<SelectedWorkSpaceProps> = ({ onClick, workspace }) => {
  const supabase = createClientComponentClient()
  const [workspaceLogo, setWorkspaceLogo] = useState('/cypresslogo.svg')
  
  useEffect(() => {
    if (workspace.logo) {
      const path = supabase.storage.from('workspace-logos').getPublicUrl(workspace.logo)?.data.publicUrl;
      console.log('PATH', path)
      setWorkspaceLogo(path)
    }
  }, [workspace, supabase])
  
  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if(onClick) onClick();
      }}
      className="flex rounded-md hover:bg-muted transition-all flex-row p-2 gap-4 justify-center cursor-pointer items-center my-2"
    >
      <Image src={workspaceLogo} alt="workspace logo" width={26} height={26} />
      <div className="flex flex-col">
        <p className="text-lg text-white w-[170px] overflow-hidden overflow-ellipsis whitespace-nowrap">
          {workspace.title}
        </p>
      </div>
    </Link>
  )
}

export default SelectedWorkspace