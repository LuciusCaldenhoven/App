import React, { useRef } from 'react';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import SingleList from '@/components/singleList/component';
import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';

type Props = {
  icon: JSX.Element;
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
  onSave?: () => void;
};

const ReusableSheet: React.FC<Props> = ({ icon, title, children, style, onSave }) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  const openSheet = () => {
    sheetRef.current?.present();
  };

  return (
    <>
      <SingleList component={icon} text={title} onPress={openSheet} />

      <BottomSheetModal
        ref={sheetRef}
        index={0}

        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={[{ padding: 20 }, style]}>
          {children}
          <TouchableOpacity style={styles.primaryButton} onPress={() => {
            onSave?.(); 
            sheetRef.current?.dismiss();
          }}>
            <Text style={styles.primaryButtonText}>Guardar cambios</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};



export default ReusableSheet;

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: "Medium"
  },

});