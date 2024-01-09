'use server';
import { validate } from 'uuid';
import { files, folders, users, workspaces } from '../../../migrations/schema';
import db from './db';
import { File, Folder, Subscription, User, workspace } from './supabase.types';
import { and, eq, ilike, notExists } from 'drizzle-orm';
import { collaborators } from './schema';


export const createWorkspace = async (workspace: workspace) => {
  try {
    const response = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: 'Error' };
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  if (!workspaceId) return;
  await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
};

export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
    if (data) return { data: data as Subscription, error: null };
    else return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: `Error` };
  }
};

export const getFolders = async (workSpaceId: string) => {
  const isValid = validate(workSpaceId);

  if (!isValid)
    return {
      data: null,
      error: 'Error'
    }
  try {
    const results: Folder[] | [] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, workSpaceId));

    return { data: results, error: null };
  } catch (error) {
    return { data: null, error: `Error` };
  }
}

const getPrivateWorkspaces = async(userId: string) => {
  if (!userId) return []

  const privateWorkspaces = await db.select({
    id: workspaces.id,
    createdAt: workspaces.createdAt,
    workspaceOwner: workspaces.workspaceOwner,
    title: workspaces.title,
    iconId: workspaces.iconId,
    data: workspaces.data,
    inTrash: workspaces.inTrash,
    logo: workspaces.logo
  })
  .from(workspaces).where(and(notExists(db.select().from(collaborators))))
}