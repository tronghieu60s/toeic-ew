import { StackNavigationProp } from '@react-navigation/stack';
import { isNull } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { getGroups } from '~/models/GroupsModel';
import { GroupType, TabPracticeParamList } from '~/types';
import { ScrollView, Text, View } from '../Themed';
import Loading from '../UI/Loading';
import GroupItem from './GroupItem';

type Props = {
  navigation: StackNavigationProp<TabPracticeParamList, 'TabPracticeScreen'>;
};

const TabPractice = memo(({ navigation }: Props) => {
  const [groups, setGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    (async () => {
      const groups = await getGroups();
      if (!isNull(groups.data)) setGroups(groups.data);
    })();
  }, []);

  const renderGroups = (order: number, limit: number) => {
    const newGroups = groups.slice(order, order + limit);
    let result: React.ReactNode = null;
    result = newGroups.map((group) => (
      <GroupItem key={group.id_group} group={group} navigation={navigation} />
    ));
    return result;
  };

  if (groups.length <= 0) return <Loading />;

  return (
    <ScrollView style={styles.container}>
      <View style={{ backgroundColor: '#f3f3f3', paddingBottom: 60 }}>
        <Text weight={700} style={styles.groupsTitle}>
          General Business
        </Text>
        <View style={styles.groups}>{renderGroups(0, 5)}</View>
        <Text weight={700} style={styles.groupsTitle}>
          Office Issues
        </Text>
        <View style={styles.groups}>{renderGroups(5, 10)}</View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 5,
  },
  groups: {
    flex: 1,
    width: Dimensions.get('window').width - 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#f3f3f3',
  },
  groupsTitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
  },
});

export default TabPractice;
