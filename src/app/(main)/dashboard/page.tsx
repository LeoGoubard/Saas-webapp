import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { cookies } from 'next/headers';
import db from '@/lib/supabase/db';
import { redirect } from 'next/navigation';
import DashboardSetup from '@/components/dashboard-setup/dashboard-setup';
import { getUserSubscriptionStatus } from '@/lib/supabase/queries';
import AppStateProvider from '@/lib/providers/state-provider';
/* import DashboardSetup from '@/components/dashboard-setup/dashboard-setup';
import { getUserSubscriptionStatus } from '@/lib/supabase/queries'; */

const DashboardPage = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const foundWorkspace = await db.query.workspaces.findFirst({ where: (workspace, { eq }) => eq(workspace.workspaceOwner, user.id) });

  const { data: subscription, error: subscriptionError } = await getUserSubscriptionStatus(user.id);

  if (subscriptionError) return;

  if (!foundWorkspace)
    return (
      <div
        className="bg-background
        h-screen
        w-screen
        flex
        justify-center
        items-center
  "
      >
        <AppStateProvider>
          <DashboardSetup
            user={user}
            subscription={subscription}
          />
        </AppStateProvider>
      </div>
    );

  redirect(`/dashboard/${foundWorkspace.id}`);
};

export default DashboardPage;