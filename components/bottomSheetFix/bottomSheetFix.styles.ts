import { scale } from '@/constants/scale';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({

  modalOverlay: {
    
    width: '100%',
  
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 65,
    paddingBottom: 50,
    position: 'absolute', 
    bottom: 0, 
   
  },
  title: {
    fontSize: 25,
    fontFamily: 'SemiBold',
    marginBottom: 14,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'left',
    fontFamily: 'Regular',
  },
  dim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  info :{
    paddingLeft : 20,
    paddingRight : 20,
  },
  buttonStyles :{
    marginHorizontal : scale(18),
    marginBottom : 20,
}
});

export default styles;