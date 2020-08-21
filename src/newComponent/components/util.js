import GroupIcon from '@material-ui/icons/Group'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import PersonIcon from '@material-ui/icons/Person'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'

export const navlinks = [
  {
    name: 'Users',
    path:'/admin/users',
    Icon: GroupIcon,
    header: 'User Lists'
  },
  // {
  //   name: 'User',
  //   path:'/admin/user',
  //   header: 'User Information',
  //   Icon: PersonIcon
  // },
  {
    name: 'Add User',
    path:'/admin/addusers',
    header: 'Add user',
    Icon: PersonAddIcon
  },
  {
    name: 'User Settings',
    path:'/admin/settings',
    header: 'Settings',
    Icon: SettingsApplicationsIcon
  }
]

export const permissionLevels = {
  admin: 'ADMIN',
  superAdmin: 'SUPERADMIN',
  revoked: 'REVOKED',
  basic: 'BASIC'
}


export const users = [
  {
    email: 'felixsonyusuftosin@gmail.com',
    token: '123-svdgf-fgghh-4t436536-5vdbghggy-67',
    status: 'BASIC,ADMIN'
  },
  {
    email: 'felixsonyusuftosin@gmail.com',
    token: '123-svdgf-fgghh-4t436536-5vdbghggy-67',
    status: 'BASIC,ADMIN'
  },
  {
    email: 'felixsonyusuftosin@gmail.com',
    token: '123-svdgf-fgghh-4t436536-5vdbghggy-67',
    status: 'BASIC,ADMIN'
  },
  {
    email: 'felixsonyusuftosin@gmail.com',
    token: '123-svdgf-fgghh-4t436536-5vdbghggy-67',
    status: 'BASIC,ADMIN'
  },
  {
    email: 'felixsonyusuftosin@gmail.com',
    token: '123-svdgf-fgghh-4t436536-5vdbghggy-67',
    status: 'BASIC,ADMIN'
  }
]