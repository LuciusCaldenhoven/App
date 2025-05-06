import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import {Toast} from '@/components/lotties/toast';
import { renderMarginBottom } from '@/constants/ui-utils';

const AnimationToast = () => {
  const toastRef = useRef<any>({});
  return (
    <>
        {renderMarginBottom(100)}
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() =>
          toastRef.current.show({
            title: 'Todo con exito',
            description: 'Subido con exito',
            type: 'success',
          })
        }>
        <Text>Exito</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() =>
          toastRef.current.show({
            type: 'warning',
            title: 'Precaucion ',
            description: 'Faltan datos.',
          })
        }>
        <Text>Warning</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() =>
          toastRef.current.show({
            type: 'error',
            title: 'Error Toast !',
            description: `algo no funciono.`,
          })
        }>
        <Text>Error</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() =>
          toastRef.current.show({
            title: 'BIENNNNNNN HECHO',
            description: 'todo good',
          })
        }>
        <Text>Default</Text>
      </TouchableOpacity>
      <Toast ref={toastRef} />
    </>
  );
};

export default AnimationToast;

const styles = StyleSheet.create({
  buttonStyle: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 50,
  },
});