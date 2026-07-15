import React from 'react'

import { useFollowers } from '../hooks/useFollowers'
import { useFollowings } from '../hooks/useFollowings'
import { useSuggestedUsers } from '../hooks/useSuggestedUsers'
import UserList from './UserList'

const Sidebar = () => {
    const {followers} = useFollowers()
    const { followings } = useFollowings()
    console.log(followings);
    const { suggestedUsers } = useSuggestedUsers()
    
  return (
   <div className="sidebar">
      <UserList title="Followers" users={followers} />
      <UserList title="Followings" users={followings} />
      <UserList title="Suggested Users" users={suggestedUsers} />
    </div>
  )
}

export default Sidebar