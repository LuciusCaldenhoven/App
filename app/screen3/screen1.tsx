import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TabSwitcherr } from '@/components/TabSwitcherr'; 

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('Review');

  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <TabSwitcherr activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'Productos' ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Contenido de Review</Text>
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Contenido de Information</Text>
      )}
    </View>
  );
}
