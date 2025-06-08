import { View, Text, Image } from 'react-native';
import React from 'react';
import { createStyles } from './chatcard.styles';
import { renderMarginBottom } from '@/constants/ui-utils';

interface IChatCardProps {
  isSelf: boolean;
  message?: string;
  time?: string;
  file?: string; // ✅ URL desde Convex
}

const ChatCard = ({ isSelf = false, message = '', time, file }: IChatCardProps) => {
  const styles = createStyles(isSelf);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.card}>
          {message !== '' && <Text style={styles.text}>{message}</Text>}
          {file && (
            <Image
              source={{ uri: file }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                marginTop: 6,
                alignSelf: isSelf ? 'flex-end' : 'flex-start',
              }}
            />
          )}
        </View>
        {renderMarginBottom(2)}
        <Text style={styles.timeStamp}>{time}</Text>
      </View>
    </View>
  );
};

export default ChatCard;
