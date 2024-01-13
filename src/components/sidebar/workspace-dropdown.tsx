'use client';

import { useAppState } from '@/lib/providers/state-provider';
import { workspace } from '@/lib/supabase/supabase.types'
import React, { useEffect, useState } from 'react'
import SelectedWorkspace from './selected-workspace';
import CustomDialogTrigger from '../global/custom-dialog-trigger';
import WorkspaceCreator from '../global/workspace-creator';

interface WorkspaceDropdownProps {
  privateWorkspaces: workspace[] | [];
  sharedWorkspaces: workspace[] | [];
  collaboratingWorkspaces: workspace[] | [];
  defaultValue: workspace | undefined;
}

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({
  privateWorkspaces,
  sharedWorkspaces,
  collaboratingWorkspaces,
  defaultValue
}) => {
  const { dispatch, state } = useAppState()
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if(!state.workspaces.length) {
      dispatch({
        type: "SET_WORKSPACES",
        payload: {
          workspaces: [
            ...privateWorkspaces,
            ...sharedWorkspaces,
            ...collaboratingWorkspaces
          ].map((workspace) => ({ ...workspace, folders: [] }))
        }
      })
    }
  
  }, [privateWorkspaces, sharedWorkspaces, collaboratingWorkspaces, dispatch, state])
  
  useEffect(() => {
    const findSelectedWorksapce = state.workspaces.find((workspace: any) => workspace.id === defaultValue?.id);

    if (findSelectedWorksapce) setSelectedOption(findSelectedWorksapce);
  }, [state, defaultValue])
  

  const handleSelect = (option: workspace) => {
    setSelectedOption(option);
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <span onClick={() => setIsOpen(!isOpen)}>
          {selectedOption ? <SelectedWorkspace workspace={selectedOption} /> : 'Select a workspace'}
        </span>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute w-full overflow-x-hidden rounded-md shadow-md z-50 h-[190px] bg-black*10 backdrop-blur-lg group overflow-scroll border-[1px] border-muted">
          <div className="!p-2">
            {!!privateWorkspaces.length && (
              <>
                <p className="text-muted-foreground">Private</p>
                <hr></hr>
                {privateWorkspaces.map((option) => (
                  <SelectedWorkspace key={option.id} workspace={option} onClick={handleSelect}/>
                ))}
              </>
            )}
            {!!sharedWorkspaces.length && (
              <>
                <p className="text-muted-foreground">Shared</p>
                <hr></hr>
                {sharedWorkspaces.map((option) => (
                  <SelectedWorkspace key={option.id} workspace={option} onClick={handleSelect}/>
                ))}
              </>
            )}
            {!!collaboratingWorkspaces.length && (
              <>
                <p className="text-muted-foreground">Collaborating</p>
                <hr></hr>
                {collaboratingWorkspaces.map((option) => (
                  <SelectedWorkspace key={option.id} workspace={option} onClick={handleSelect}/>
                ))}
              </>
            )}
          </div>
          <CustomDialogTrigger
            header="Create a Workspace"
            className=''
            content={<WorkspaceCreator />}
            description="Workspaces give yout he power to collaborate with your colleagues"
          >
            <div className="flex transition-all hover:bg-muted justify-center items-center gap-2 p-2 w-full">
              <article className="text-slate-500 rounded-full bg-slate-800 w-4 h-4 flex items-center justify-center">
                +
              </article>
              Create Workspace
            </div>
          </CustomDialogTrigger>
        </div>

      )}
    </div>
  )
}

export default WorkspaceDropdown