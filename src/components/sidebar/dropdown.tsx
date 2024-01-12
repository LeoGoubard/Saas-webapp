'use client'

import { useAppState } from '@/lib/providers/state-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { AccordionItem, AccordionTrigger } from '../ui/accordion';
import clsx from 'clsx';
import EmojiPicker from '../global/emoji-picker';
import { updateFolder } from '@/lib/supabase/queries';
import { useToast } from '../ui/use-toast';
import TooltipComponent from '../global/tooltip-component';
import { PlusIcon, TrashIcon } from 'lucide-react';

interface DropdownProps {
  title: string;
  id: string;
  listType: 'folder' | 'file';
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}) => {
  const supabase = createClientComponentClient()
  const { toast } = useToast();
  const { state, dispatch, workspaceId, folderId } = useAppState()
  const [isEditing, setIsEditting] = useState(false);
  const router = useRouter();

  const folderTitle: string | undefined = useMemo(() => {
    if (listType === 'folder') {
      const stateTitle = state.workspaces.find((workspace) => workspace.id === workspaceId)
      ?.folders.find((folder) => folder.id === id)?.title;

      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title])


  const fileTitle: string | undefined = useMemo(() => {
    if (listType === 'file') {
      const fileAndFolderId = id.split('folder');
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileAndFolderId[0])
        ?.files.find((file) => file.id === fileAndFolderId[1])?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  const handleDoubleClick = () => {
    setIsEditting(true)
  }

  const handleBlur = async() => {
    setIsEditting(false)
    const fId = id.split('folder')
    if (fId?.length === 1) {
      if (!folderTitle) return;

      await updateFolder({ title }, fId[0])
    }

    if (fId.length === 2 && fId[1]) {
      if (!fileTitle) return;
    }

  }

  const navigatePage = (accordionId: string, type: string) => {
    if (type === 'folder') {
      router.push(`/dashboard/${workspaceId}/${accordionId}`)
    }
    if (type === 'file') {
      router.push(`/dashboard/${workspaceId}/${folderId}/${accordionId}`)
    }
  }

  const onChangeEmoji = async(selectedEmoji: string) => {
    if (!workspaceId) return;
    if (listType === 'folder') {
      dispatch({ type: 'UPDATE_FOLDER', payload: { workspaceId, folderId: id, folder: {
        iconId: selectedEmoji
      }}})
      const { data, error } = await updateFolder({ iconId: selectedEmoji }, id)
      if (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Cannot update Emoji for this folder"
        })
      } else {
        toast({
          title: "Success",
          description: "Emoji updated"
        })
      }
    }
  }


  const folderTitleChange = () => {
    if (!workspaceId) return;
    const fId = id.split('folder');
    if (fId.length === 1) {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          folder: { title },
          folderId: fId[0],
          workspaceId
        }
      })
    }
  }

  const fileTitleChange = (e: any) => {
    const fId = id.split('fodler');
    if (fId.length === 2 && fId[1]) {

    }

  }
  const isFolder = listType === 'folder';

  const listStyles = useMemo(() => clsx('relative', {
    'border-none text-md': isFolder,
    'border-none ml-6 text-[16px] py-1': !isFolder
  }), [isFolder])

  const groupIdentifies = useMemo(() => clsx('dark:text-white whitespace-nowrap flex justify-between items-center w-full relative', {
      'group/folder': isFolder,
      'group/file': !isFolder,
    }), [isFolder])

  return (
    <AccordionItem
      value={id}
      className={listStyles}
      onClick={(e: any) => {
        e.stopPropagation();
        navigatePage(id, listType)
      }}
    >
      <AccordionTrigger id={listType} className="hover:no-underline p-2 dark:text-muted-foreground text-sm" disabled={listType === 'file'}>
        <div className={groupIdentifies}>
          <div className="flex gap-4 items-center justify-center overflow-hidden">
            <div className="relative">
              <EmojiPicker getValue={onChangeEmoji}>{iconId}</EmojiPicker>
            </div>
            <input
              type="text"
              value={listType === 'folder' ? folderTitle : fileTitle}
              className={clsx(
                'outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7',
                {
                  'bg-muted cursor-text': isEditing,
                  'bg-transparent cursor-pointer': !isEditing,
                }
              )}
              readOnly={!isEditing}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={
                listType === 'folder' ? folderTitleChange : fileTitleChange
              }
            />
          </div>
          <div className="h-full hidden group-hover/file:block rounded-sm absolute right-0 items-center gap-2 justify-center">
            <TooltipComponent message="Delete Folder">
              <TrashIcon
                // onClick={moveToTrash}
                size={15}
                className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
              />
            </TooltipComponent>
            {listType === "folder" && !isEditing && (
              <TooltipComponent message="Add File">
                <PlusIcon
                  // onClick={addNewFile}
                  size={15}
                  className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                />
              </TooltipComponent>
            )}
          </div>
        </div>
      </AccordionTrigger>
    </AccordionItem>
  )
}

export default Dropdown