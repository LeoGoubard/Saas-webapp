import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { cookies } from 'next/headers';
import { getCollaboratingWorkspaces, getFolders, getPrivateWorkspaces, getSharedWorkspaces, getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import WorkspaceDropdown from './workspace-dropdown';

interface SidebarProps {
  params: { workspaceid: string };
  className?: string;
}

const Sidebar = async ({ params, className } : SidebarProps ) => {

  const supabase = createServerComponentClient({ cookies });
  //user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;
  //subscr
  const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);

  //folders
  const { data: workspaceFolderData, error: foldersError } = await getFolders(
    params.workspaceid
  );


  /* //error
  if (subscriptionError || foldersError) redirect('/dashboard'); */
  
  const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] = await Promise.all([
    getPrivateWorkspaces(user.id),
    getCollaboratingWorkspaces(user.id),
    getSharedWorkspaces(user.id)
  ])
  // Return your component content here
  return (
    <aside className={twMerge("hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between", className)}>
      <div>
        <WorkspaceDropdown
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...sharedWorkspaces,
            ...collaboratingWorkspaces
          ].find(workspace => workspace.id === params.workspaceid)}
        >

        </WorkspaceDropdown>
      </div>
    </aside>
  );
};

export default Sidebar;
