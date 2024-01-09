import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { cookies } from 'next/headers';
import { getFolders, getUserSubscriptionStatus } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

interface SidebarProps {
  params: { workspaceId: string };
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
    params.workspaceId
  );
  //error
  if (subscriptionError || foldersError) redirect('/dashboard');

  // Return your component content here
  return <div>Sidebar</div>;
};

export default Sidebar;
