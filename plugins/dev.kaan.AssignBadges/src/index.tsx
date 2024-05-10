import React, { FC, useEffect, useState } from 'react';
import { components, Injector, settings, webpack } from 'replugged';
import { flux } from "replugged/common";
import { ContextMenuTypes } from 'replugged/types';
import { Badges } from './badges';

const {
  ContextMenu: { MenuItem, MenuCheckboxItem },
} = components;
const config = await settings.init('dev.kaan.assignBadges');
const UserProfileStore: {getUserProfile: (id: string) => any} = webpack.getByStoreName('UserProfileStore');
const injector = new Injector();
const FetchUtils: any = webpack.getByProps("fetchProfile");

interface Badge {
  id: string;
}

const toPascalCase = (str) => {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function assignBadge(user: any, badge: Badge): void {
  const Profile = UserProfileStore.getUserProfile(user.id);
  const OriginalBadges = Profile.badges;
  const badgeIndex = OriginalBadges.findIndex((x: Badge) => x.id === badge.id);
  if (badgeIndex !== -1) {
    OriginalBadges.splice(badgeIndex, 1);
  } else {
    OriginalBadges.push(badge);
  }
  Profile.badges = OriginalBadges;

  const badgesMap = config.get('badges'); 
  badgesMap[user.id] = Profile.badges;
  config.set('badges', badgesMap);
  console.log(badgesMap)
}

function setUserProfile(userId: string, badgesA: any): void {
  console.log(badgesA)
  UserProfileStore.getUserProfile(userId).badges = badgesA
}

function doesBadgeExist(data: any, badge: Badge, callback: (exists: boolean) => void): void {
  let UserBadges = UserProfileStore.getUserProfile(data.user.id)?.badges;
  if (!UserBadges) {
    /*FetchUtils.fetchProfile(data.user.id).then((dataProfile: { badges: any; }) => {
      UserBadges = dataProfile.badges;
      const exists = UserBadges ? UserBadges.findIndex((x: Badge) => x.id === badge.id) !== -1 : false;
      callback(exists);
      return;
    });*/
    return callback(false);
  } else {
    const exists = UserBadges.findIndex((x: Badge) => x.id === badge.id) !== -1;
    callback(exists);
    return;
  }
  return
}

/* 
      <MenuItem
        id={'remove-badges'}
        label={'Restore Badges'}
        action={() => {
          const userId = data.user.id;
          const badgesConfig = config.get('badges');
          delete badgesConfig[userId];
          config.set('badges', badgesConfig);
          setUserProfile(userId, badgesConfig[userId])
        }}
      />
*/

export const start: FC = () => {
  injector.after(UserProfileStore,'getUserProfile', (a,b) => {
    if (config.get('badges',[])[b?.userId])
    {
      b.badges = config.get('badges')[b.userId]
    }
  })
  injector.utils.addMenuItem(ContextMenuTypes.UserContext, (data: { user: any }) => (
    <MenuItem id={'assign-menu'} label="Assign Badges">
      {Badges.map((badge: Badge) => {
        const [checked, setChecked] = useState(false);
        useEffect(() => {
          doesBadgeExist(data, badge, (exists) => {
            setChecked(exists);
          });
        }, [data, badge]);

        return (
          <MenuCheckboxItem
            key={badge.id}
            id={`assign-${badge.id}`}
            label={toPascalCase(badge.id.replaceAll('_',' '))}
            checked={checked}
            action={() => {
              assignBadge(data.user, badge);
              doesBadgeExist(data, badge, (exists) => {
                setChecked(exists);
              });
              console.log(UserProfileStore.getUserProfile(data.user.id));
            }}
          />
        );
      })}
    </MenuItem>
  ));
};

export function stop(): void {
  injector.uninjectAll();
}
