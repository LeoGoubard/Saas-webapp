'use client';
import { AuthUser } from '@supabase/supabase-js';
import React, { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import EmojiPicker from '../global/emoji-picker';

interface DashboardSetupProps {
  user: AuthUser;
  subscription: {} | null;
}

const DashboardSetup: React.FC<DashboardSetupProps> = ({
  subscription,
  user,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState('💼');

  return (
    <Card
      className="w-[800px]
      h-screen
      sm:h-auto
  "
    >
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>
          Lets create a private workspace to get you started.You can add
          collaborators later from the workspace settings tab.
        </CardDescription>
        <CardContent>
          <form onSubmit={() => {}}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl">
                  <EmojiPicker getValue={() => {}}>
                    {selectedEmoji}
                  </EmojiPicker>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default DashboardSetup;
