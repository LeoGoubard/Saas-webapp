'use client'

import { useAppState } from '@/lib/providers/state-provider';
import { User, workspace } from '@/lib/supabase/supabase.types';
import React, { useEffect, useRef, useState } from 'react'
import { useToast } from '../ui/use-toast';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Briefcase, CreditCard, ExternalLink, Lock, LogOut, Plus, Share, User as UserIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import {
  addCollaborators,
  deleteWorkspace,
  findUser,
  getCollaborators,
  removeCollaborators,
  updateUser,
  updateWorkspace,
} from '@/lib/supabase/queries';
import { Input } from '../ui/input';
import { v4 } from 'uuid';
import CollaboratorSearch from '../global/collaborator-search';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { AlertDialogAction } from '@radix-ui/react-alert-dialog';
import CypressProfileIcon from '../icons/cypressProfileIcon';
import LogoutButton from '../global/logout-button';
import Link from 'next/link';

const SettingsForm = () => {
  const { toast } = useToast();
  const { user, subscription } = useSupabaseUser()
  const supabase = createClientComponentClient();
  // const { open, setOpen } = useSubscriptionModal();
  const router = useRouter();
  const { state, workspaceId, dispatch } = useAppState()
  const [permissions, setPermissions] = useState('privaet');
  const [collaborators, setCollaborators] = useState<User[] | []>([])
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [workspaceDetails, setWorkspaceDetails] = useState<workspace>()
  const titleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [uploadingProfilPic, setUploadingProfilPic] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  //WIP PAYMENT PORTAL

  const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return;
    dispatch({
      type:'UPDATE_WORKSPACE',
      payload: { workspace: { title: e.target.value }, workspaceId },
    })
    if(titleTimerRef.current) clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout(async() => {
      await updateWorkspace({ title: e.target.value }, workspaceId )
    }, 500)

  }

  const addCollaborator = async (profile: User) => {
    if (!workspaceId) return;
    if (subscription?.status !== 'active' && collaborators.length >= 2) {
      // setOpen(true);
      return;
    }
    await addCollaborators([profile], workspaceId);
    setCollaborators([...collaborators, profile]);
  };

  //remove collaborators
  const removeCollaborator = async (user: User) => {
    if (!workspaceId) return;
    if (collaborators.length === 1) {
      setPermissions('private');
    }
    await removeCollaborators([user], workspaceId);
    setCollaborators(
      collaborators.filter((collaborator) => collaborator.id !== user.id)
    );
    router.refresh();
  };

  const onChangeWorkspaceLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId)  return;
    const file = e.target.files?.[0];
    if (!file) return;

    const uuid = v4();
    setUploadingLogo(true);
    const { data, error } = await supabase.storage
    .from('workspace-logos')
    .upload(`workspaceLogo.${uuid}`, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (!error) {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: { workspace: { logo: data.path }, workspaceId },
      });
      await updateWorkspace({ logo: data.path }, workspaceId);
      setUploadingLogo(false)
    }
  }

  const onChangeProfilPicture = async(e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId)  return;
    const file = e.target.files?.[0];
    if (!file) return;

    const uuid = v4();
    setUploadingLogo(true);
    const { data, error } = await supabase.storage
    .from('user-avatars')
    .upload(`userAvatar.${uuid}`, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (!error && user && data) {
      await updateUser({ avatarUrl: data.path }, user.id);
      setUploadingLogo(false)
    }
  }

  const onClickAlertConfirm = async() => {
    if (!workspaceId) return;
    if (collaborators.length > 0) {
      await removeCollaborators(collaborators, workspaceId);
    }

    setPermissions('private')
    setOpenAlertMessage(false)
  }

  const onPermissionChange = (val: string) => {
    if(val === 'private') {
      setOpenAlertMessage(true)
    } else setPermissions(val)
  }
  //fetching avatar details
  useEffect(() => {
    const fetchAvatar = async() => {
      if (!user) return;
      const response = await findUser(user.id);
      if (!response) return;
      setAvatarUrl(response.avatarUrl ? supabase.storage.from('user-avatars').getPublicUrl(response.avatarUrl).data.publicUrl  : '')
    }
    fetchAvatar();
  }, [user, supabase]);

  useEffect(() => {
    const showingWorkspace = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    );
    if (showingWorkspace) setWorkspaceDetails(showingWorkspace);
  }, [workspaceId, state]);

  useEffect(() => {
    if (!workspaceId) return;
    const fetchCollaborators = async() => {
      const response = await getCollaborators(workspaceId)

      if (response.length) {
        setPermissions('shared')
        setCollaborators(response)
      }
    }

    fetchCollaborators()

  }, [workspaceId, state]);

  return (
    <div className="flex gap-4 flex-col">
      <p className="flex items-center gap-2 mt-6">
        <Briefcase size={20} />
      </p>
      <Separator />
      <div className="flex flex-col gap(2">
        <Label htmlFor="workspaceName" className="text-sm text-muted-foreground">
          Name
        </Label>
        <Input
          name="workspaceName"
          value={workspaceDetails ? workspaceDetails.title : ''}
          placeholder="worksapceName"
          onChange={workspaceNameChange}
        />
        <Label
          htmlFor="workspaceLogo"
          className="text-sm text-muted-foreground"
        >
          WorkspaceLogo
        </Label>
        <Input
          name="workspaceLogo"
          type="file"
          accept="image/*"
          placeholder="Workspace Logo"
          onChange={onChangeWorkspaceLogo}
          // WIP SUBSCRIPTION
          disabled={uploadingLogo}
        />
      </div>
      <>
        <Label htmlFor="permissions">Permissions</Label>
        <Select
          onValueChange={onPermissionChange}
          value={permissions}
        >
          <SelectTrigger className="w-full h-26 -mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">
                <div className="flex gap-4 justify-center items-center">
                  <Lock />
                  <article className="text-left flex flex-col">
                    <span>Private</span>
                    <p>Your workspace is private to you. You can choose to share it later.</p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value="shared">
                <div className="flex gap-4 justify-center items-center">
                  <Share />
                  <article className="text-left flex flex-col">
                    <span>Share</span>
                    <p>You can invite sollaborators.</p>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {permissions == "shared" && (
          <div>
            <CollaboratorSearch
              existingCollaborators={collaborators}
              getCollaborator={(user) => {
                addCollaborator(user)
              }}
            >
            <Button type="button" className="text-sm mt-4">
              <Plus />
              Add Collaborators
            </Button>
            </CollaboratorSearch>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                Collaborators {collaborators.length || ''}
              </span>
              <ScrollArea className="h-[120px] overflow-y-scroll w-full rounded-md border border-muted-foreground/2">
                {collaborators.length ? collaborators.map((c) => (
                  <div className="p-4 flex justify-between items-center" key={c.id}>
                    <div className="flex gap-4 items-center">
                      <Avatar>
                        <AvatarImage src="/avatars/7.png" />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <div className="text-sm gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-[300px] w-[140px]">
                        {c.email}
                      </div>
                    </div>
                    <Button variant='secondary' onClick={() => removeCollaborator(c)}>Remove</Button>
                  </div>
                )) : (
                <div className="absolute right-0 left-0 top-0 bottom-0 flex justify-center items-center">
                  <span className="text-muted-foreground text-sm">You have no Collaborators</span>
                </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}
         <Alert variant={'destructive'}>
          <AlertDescription>
            Warning! deleting you workspace will permanantly delete all data
            related to this workspace.
          </AlertDescription>
          <Button
            type="submit"
            size={'sm'}
            variant={'destructive'}
            className="mt-4 
            text-sm
            bg-destructive/40 
            border-2 
            border-destructive"
            onClick={async () => {
              if (!workspaceId) return;
              await deleteWorkspace(workspaceId);
              toast({ title: 'Successfully deleted your workspae' });
              dispatch({ type: 'DELETE_WORKSPACE', payload: workspaceId });
              router.replace('/dashboard');
            }}
          >
            Delete Workspace
          </Button>
        </Alert>
        <p className="flex items-center gap-2 mt-6">
          <UserIcon size={26} />Profile
        </p>
        <Separator />
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              <CypressProfileIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-6">
            <small className="text-muted-foreground cursor-not-allowed">{user ? user.email : ''}</small>
            <Label htmlFor="profilePicture" className="text-sm text-muted-foreground">
              Profile Picture
            </Label>
            <Input
              name="profilePicture"
              type="file"
              accept="image/*"
              placeholder='Profile Picture'
              onChange={onChangeProfilPicture}
              disabled={uploadingProfilPic}
            />
          </div>
        </div>
        <LogoutButton>
          <div className="flex items-center">
            <LogOut />
          </div>
        </LogoutButton>
        <p className="flex items-center gap-2 mt-6">
          <CreditCard size={20}/>Billing & Plan
        </p>
        <Separator />
        <p className="text-muted-foreground">
          {subscription?.status === 'active' ? 'Pro' : 'Free'}Plan
        </p>
        <Link href='/' target="_blank" className="text-muted-foreground flex flex-row items-center gap-2">
          View Plans <ExternalLink size={16} />
        </Link>
      </>
      <AlertDialog open={openAlertMessage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing a Shared workspace to a Private worksapce will remove all collaborators permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlertMessage(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onClickAlertConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SettingsForm