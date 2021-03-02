import { StackNavigationProp } from '@react-navigation/stack';
import React, { memo, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { getGroups } from '~/src/models/GroupsModel';
import tailwind from '~/tailwind';
import { GroupType, TabPracticeParamList } from '~/types';
import { ScrollView, Text, View } from '../Themed';
import ScreenEmpty from '../UI/ScreenEmpty';
import ScreenLoading from '../UI/ScreenLoading';
import GroupItem from './GroupItem';

type Props = {
  navigation: StackNavigationProp<TabPracticeParamList, 'TabPracticeScreen'>;
};

export default memo(function TabPractice(props: Props) {
  const { navigation } = props;
  const [isPending, setIsPending] = useState(true);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [groupsRender, setGroupsRender] = useState<{ title: string; data: GroupType[] }[]>([]);

  useEffect(() => {
    (async () => {
      const groups = await getGroups();
      if (groups.data !== null) setGroups(groups.data);
      setIsPending(false);
    })();
  }, []);

  useEffect(() => {
    const groupsData = [
      {
        title: '1. General Business',
        data: groups.slice(0, 5),
      },
      {
        title: '2. Office Issues',
        data: groups.slice(5, 10),
      },
      {
        title: '3. Personnel',
        data: groups.slice(10, 15),
      },
      {
        title: '4. Purchasing',
        data: groups.slice(15, 20),
      },
      {
        title: '5. Financing and Budgeting',
        data: groups.slice(20, 25),
      },
      {
        title: '6. Management Issues',
        data: groups.slice(25, 30),
      },
      {
        title: '7. Restaurants and Events',
        data: groups.slice(30, 35),
      },
      {
        title: '8. Travel',
        data: groups.slice(35, 40),
      },
      {
        title: '9. Entertainment',
        data: groups.slice(40, 45),
      },
      {
        title: '10. Health',
        data: groups.slice(45, 50),
      },
    ];
    setGroupsRender(groupsData);
  }, [groups]);

  const renderItems = (groups: { title: string; data: GroupType[] }[]) => {
    return groups.map((group, index) => (
      <React.Fragment key={index}>
        {group.data.length > 0 && (
          <Text weight={700} style={styles.groupsTitle}>
            {group.title}
          </Text>
        )}
        <ScrollView horizontal style={styles.groups}>
          {group.data.map((item, index) => (
            <GroupItem key={index} group={item} navigation={navigation} />
          ))}
        </ScrollView>
      </React.Fragment>
    ));
  };

  const text = 'Không tải được dữ liệu,\nvui lòng xóa dữ liệu và khởi động lại ứng dụng.';
  if (isPending) return <ScreenLoading />;
  if (groups.length <= 0) return <ScreenEmpty>{text}</ScreenEmpty>;

  return (
    <ScrollView light style={tailwind('flex-1')}>
      <View light style={tailwind('pt-1 px-1')}>
        {renderItems(groupsRender)}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  groups: { ...tailwind('flex-1 flex-row bg-transparent') },
  groupsTitle: { ...tailwind('text-sm my-2 ml-2') },
});
