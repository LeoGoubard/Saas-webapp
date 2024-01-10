'use client'

import { User } from '@/lib/supabase/supabase.types'
import React, { useState } from 'react'

const WorkspaceCreator = () => {
  const [permissions, setPermissions] = useState("private")
  const [title, seTitle] = useState("")
  const [collaborators, setCollaboratos] = useState<User[]>([])
  const [user, setUser] = useState()

  return (
    <div>WorkspaceCreator</div>
  )
}

export default WorkspaceCreator